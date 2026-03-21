import { supabase } from '@/integrations/supabase/client';

export interface BannerRow {
    id: string;
    title: string;
    image_url: string | null;
    link_url: string | null;
    active: boolean;
    created_at?: string;
}

const TABLE = 'banners';

export const SupabaseBannersService = {
    async getActiveBanners(): Promise<BannerRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Banners table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching active banners:', error);
            return [];
        }
    },

    async getAllBanners(): Promise<BannerRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Banners table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching banners:', error);
            return [];
        }
    },

    async addBanner(banner: Omit<BannerRow, 'id' | 'created_at'>): Promise<{ success: boolean; row?: BannerRow; error?: any }> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .insert([banner])
                .select()
                .single();

            if (error) throw error;
            return { success: true, row: data as BannerRow };
        } catch (err) {
            console.error('Error adding banner:', err);
            return { success: false, error: err };
        }
    },

    async updateBanner(id: string, updates: Partial<BannerRow>): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase
                .from(TABLE)
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error updating banner:', err);
            return { success: false, error: err };
        }
    },

    async deleteBanner(id: string): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase.from(TABLE).delete().eq('id', id);
            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error deleting banner:', err);
            return { success: false, error: err };
        }
    },

    async replaceAll(banners: Omit<BannerRow, 'id' | 'created_at'>[]): Promise<{ success: boolean; error?: any }> {
        try {
            const { error: delErr } = await supabase.from(TABLE).delete().gte('created_at', '1970-01-01');
            if (delErr && delErr.code !== '42P01') throw delErr;

            if (banners.length > 0) {
                const { error: insErr } = await supabase.from(TABLE).insert(banners);
                if (insErr) throw insErr;
            }
            return { success: true };
        } catch (err) {
            console.error('Error replacing banners:', err);
            return { success: false, error: err };
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.banners (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  title text NOT NULL,\n  image_url text,\n  link_url text,\n  active boolean DEFAULT true,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseBannersService;
