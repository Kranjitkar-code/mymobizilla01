import { supabase } from '@/integrations/supabase/client';

export interface PhoneModelRow {
  id: string;
  brand: string;
  series?: string | null;
  model: string;
  image_url: string | null;
  base_price?: number | null;
  created_at?: string | null;
}

const TABLE = 'phone_models';
const STORAGE_BUCKET = 'phone-models';

function canonBrandName(itemBrand: string, brands: { name: string }[]): string {
  const found = brands.find((b) => b.name.toLowerCase() === itemBrand.toLowerCase());
  return found?.name ?? itemBrand;
}

export const SupabasePhonesService = {
  async getModelsByBrand(brand: string): Promise<PhoneModelRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .ilike('brand', brand)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as PhoneModelRow[]) || [];
    } catch (error) {
      console.error('Error fetching phone models from Supabase:', error);
      return [];
    }
  },

  async getAllModels(): Promise<PhoneModelRow[]> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data as PhoneModelRow[]) || [];
    } catch (error) {
      console.error('Error fetching all phone models from Supabase:', error);
      return [];
    }
  },

  /**
   * Add one model. Supports object form or legacy positional: (brand, model, file?, basePrice?).
   */
  async addModel(
    paramsOrBrand:
      | string
      | {
          brand: string;
          series?: string | null;
          model: string;
          imageFile?: File;
          basePrice?: number;
        },
    modelName?: string,
    imageFile?: File,
    basePrice?: number,
  ): Promise<{ success: boolean; row?: PhoneModelRow; error?: unknown }> {
    const params =
      typeof paramsOrBrand === 'string'
        ? {
            brand: paramsOrBrand,
            model: modelName ?? '',
            imageFile,
            basePrice,
          }
        : paramsOrBrand;

    if (!params.brand?.trim() || !params.model?.trim()) {
      return { success: false, error: new Error('Brand and model are required') };
    }

    try {
      let imageUrl: string | null = null;

      if (params.imageFile) {
        const timestamp = Date.now();
        const safeName = params.imageFile.name.replace(/[^a-z0-9.\-_]/gi, '_');
        const path = `${params.brand}/${timestamp}-${safeName}`;

        const { error: upErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, params.imageFile, { cacheControl: '3600', upsert: false });
        if (upErr) {
          console.warn('Storage upload warning/error:', upErr.message || upErr);
        } else {
          const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
          imageUrl = publicData?.publicUrl || null;
        }
      }

      const insert = {
        brand: params.brand.trim(),
        series: params.series ?? null,
        model: params.model.trim(),
        image_url: imageUrl,
        base_price: params.basePrice ?? null,
      };

      const { data, error } = await supabase.from(TABLE).insert([insert]).select().single();
      if (error) throw error;
      return { success: true, row: data as PhoneModelRow };
    } catch (err) {
      console.error('Error adding phone model:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Seed many models (e.g. Load Defaults). Skips rows whose brand is not in `brands`, or duplicate brand+model.
   */
  async bulkSeedPhoneModels(
    items: { brand: string; model: string; series?: string | null }[],
    brands: { name: string }[],
    existing: PhoneModelRow[],
  ): Promise<{ inserted: number; skipped: number; failed: number; lastError?: string }> {
    const allowed = new Set(brands.map((b) => b.name.toLowerCase()));
    const seen = new Set(
      existing.map((m) => `${(m.brand ?? '').toLowerCase()}|${(m.model ?? '').toLowerCase()}`),
    );

    let inserted = 0;
    let skipped = 0;
    let failed = 0;
    let lastError: string | undefined;

    for (const item of items) {
      if (!allowed.has(item.brand.toLowerCase())) {
        skipped++;
        continue;
      }

      const brand = canonBrandName(item.brand, brands);
      const key = `${brand.toLowerCase()}|${item.model.toLowerCase()}`;
      if (seen.has(key)) {
        skipped++;
        continue;
      }
      seen.add(key);

      const { error } = await supabase.from(TABLE).insert([
        {
          brand,
          model: item.model,
          series: item.series ?? null,
          image_url: null,
          base_price: null,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          skipped++;
        } else {
          failed++;
          lastError = error.message || String(error);
          console.error('bulkSeedPhoneModels insert failed:', item, error);
        }
      } else {
        inserted++;
      }
    }

    return { inserted, skipped, failed, lastError };
  },

  async deleteModel(id: string): Promise<{ success: boolean; error?: unknown }> {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error deleting phone model:', err);
      return { success: false, error: err };
    }
  },

  async ensureSchema(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.from(TABLE).select('id').limit(1);
      if (error) {
        console.warn('Phone models table not accessible:', error.message || error);
        try {
          const { error: funcErr } = await supabase.functions.invoke('init-phone-models');
          if (funcErr) throw funcErr;
          return { success: true, message: 'Edge function invoked: init-phone-models' };
        } catch (fErr: unknown) {
          console.warn('Could not invoke init-phone-models function:', fErr);
          const sql = `-- Run the following SQL in Supabase SQL editor to create the table and storage bucket\n
-- Create table\nCREATE TABLE IF NOT EXISTS public.phone_models (\n+  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n+  brand text NOT NULL,\n+  model text NOT NULL,\n+  image_url text,\n+  base_price numeric,\n+  created_at timestamptz DEFAULT now()\n+);\n\n-- Optional: create storage bucket named '${STORAGE_BUCKET}' via Supabase UI -> Storage -> New bucket\n`;
          console.log('\n❗ Manual SQL to run in Supabase SQL editor:\n');
          console.log(sql);
          return { success: false, message: 'Table does not exist. SQL printed to console for manual creation.' };
        }
      }

      return { success: true, message: 'Table accessible' };
    } catch (err: unknown) {
      console.error('Error checking/ensuring schema:', err);
      return { success: false, message: err instanceof Error ? err.message : String(err) };
    }
  },
};

if (typeof window !== 'undefined') {
  (window as unknown as { SupabasePhonesService: typeof SupabasePhonesService }).SupabasePhonesService =
    SupabasePhonesService;
}

export default SupabasePhonesService;
