import { supabase } from '@/integrations/supabase/client';

export interface BrandRow {
    id: string;
    name: string;
    logo_url: string | null;
    created_at?: string;
}

const TABLE = 'brands';
const STORAGE_BUCKET = 'brand-logos';

export const SupabaseBrandsService = {
    async getAllBrands(): Promise<BrandRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                // If table doesn't exist, return empty array silently (or log warning)
                if (error.code === '42P01') { // undefined_table
                    console.warn('Brands table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching brands:', error);
            return [];
        }
    },

    async addBrand(params: { name: string; logoFile?: File }): Promise<{ success: boolean; row?: BrandRow; error?: any }> {
        try {
            let logoUrl: string | null = null;

            if (params.logoFile) {
                const timestamp = Date.now();
                const safeName = params.logoFile.name.replace(/[^a-z0-9.\-_]/gi, '_');
                const path = `${timestamp}-${safeName}`;

                const { error: upErr } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(path, params.logoFile, { cacheControl: '3600', upsert: false });

                if (upErr) {
                    // If bucket doesn't exist, we might fail here. 
                    console.warn('Storage upload failed:', upErr);
                } else {
                    const { data: publicData } = supabase.storage
                        .from(STORAGE_BUCKET)
                        .getPublicUrl(path);
                    logoUrl = publicData?.publicUrl || null;
                }
            }

            const { data, error } = await supabase
                .from(TABLE)
                .insert([{ name: params.name, logo_url: logoUrl }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, row: data as BrandRow };
        } catch (err) {
            console.error('Error adding brand:', err);
            return { success: false, error: err };
        }
    },

    async deleteBrand(id: string): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase.from(TABLE).delete().eq('id', id);
            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error deleting brand:', err);
            return { success: false, error: err };
        }
    },

    // Helper to ensure schema exists (similar to PhonesService)
    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run this in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.brands (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  name text NOT NULL UNIQUE,\n  logo_url text,\n  created_at timestamptz DEFAULT now()\n);\n\n-- Create storage bucket 'brand-logos' in Supabase Storage`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged to console.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseBrandsService;
