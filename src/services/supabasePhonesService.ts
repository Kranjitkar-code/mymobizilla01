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

export const SupabasePhonesService = {
  async getModelsByBrand(brand: string): Promise<PhoneModelRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .ilike('brand', brand)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      console.error('Error fetching phone models from Supabase:', error);
      return [];
    }
  },

  async getAllModels(): Promise<PhoneModelRow[]> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      console.error('Error fetching all phone models from Supabase:', error);
      return [];
    }
  },

  async addModel(params: {
    brand: string;
    series?: string | null;
    model: string;
    imageFile?: File;
    basePrice?: number;
  }): Promise<{ success: boolean; row?: PhoneModelRow; error?: any }> {
    try {
      let imageUrl: string | null = null;

      if (params.imageFile) {
        const timestamp = Date.now();
        const safeName = params.imageFile.name.replace(/[^a-z0-9.\-_]/gi, '_');
        const path = `${params.brand}/${timestamp}-${safeName}`;

        // Upload to storage bucket
        const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(path, params.imageFile, { cacheControl: '3600', upsert: false });
        if (upErr) {
          console.warn('Storage upload warning/error:', upErr.message || upErr);
        } else {
          const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
          imageUrl = publicData?.publicUrl || null;
        }
      }

      const insert = {
        brand: params.brand,
        series: params.series || null,
        model: params.model,
        image_url: imageUrl,
        base_price: params.basePrice ?? null,
      } as any;

      const { data, error } = await supabase.from(TABLE).insert([insert]).select().single();
      if (error) throw error;
      return { success: true, row: data as PhoneModelRow };
    } catch (err) {
      console.error('Error adding phone model:', err);
      return { success: false, error: err };
    }
  },

  async deleteModel(id: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error deleting phone model:', err);
      return { success: false, error: err };
    }
  },

  // Console initializer: try to ensure table & storage exist or provide SQL fallback
  async ensureSchema(): Promise<{ success: boolean; message?: string }> {
    try {
      // Try a harmless select to detect if table exists
      const { error } = await supabase.from(TABLE).select('id').limit(1);
      if (error) {
        console.warn('Phone models table not accessible:', error.message || error);
        // Try to call an edge function named `init-phone-models` if deployed
        try {
          const { data: funcData, error: funcErr } = await supabase.functions.invoke('init-phone-models');
          if (funcErr) throw funcErr;
          return { success: true, message: 'Edge function invoked: init-phone-models' };
        } catch (fErr) {
          console.warn('Could not invoke init-phone-models function:', fErr?.message || fErr);
          // Provide SQL statements for manual run
          const sql = `-- Run the following SQL in Supabase SQL editor to create the table and storage bucket\n
-- Create table\nCREATE TABLE IF NOT EXISTS public.phone_models (\n+  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n+  brand text NOT NULL,\n+  model text NOT NULL,\n+  image_url text,\n+  base_price numeric,\n+  created_at timestamptz DEFAULT now()\n+);\n\n-- Optional: create storage bucket named '${STORAGE_BUCKET}' via Supabase UI -> Storage -> New bucket\n`;
          console.log('\n❗ Manual SQL to run in Supabase SQL editor:\n');
          console.log(sql);
          return { success: false, message: 'Table does not exist. SQL printed to console for manual creation.' };
        }
      }

      return { success: true, message: 'Table accessible' };
    } catch (err) {
      console.error('Error checking/ensuring schema:', err);
      return { success: false, message: err?.message || String(err) };
    }
  }
};

// Expose for console use
if (typeof window !== 'undefined') {
  (window as any).SupabasePhonesService = SupabasePhonesService;
}

export default SupabasePhonesService;
