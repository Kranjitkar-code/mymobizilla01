import { supabase } from '@/integrations/supabase/client';

export interface ServiceRow {
    id: string;
    title: string;
    description: string | null;
    price_range: string | null;
    icon: string | null;
    created_at?: string;
}

const TABLE = 'services';

export const SupabaseServicesService = {
    async getAll(): Promise<ServiceRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Services table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    },

    async addService(service: Omit<ServiceRow, 'id' | 'created_at'>): Promise<{ success: boolean; row?: ServiceRow; error?: any }> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .insert([service])
                .select()
                .single();

            if (error) throw error;
            return { success: true, row: data as ServiceRow };
        } catch (err) {
            console.error('Error adding service:', err);
            return { success: false, error: err };
        }
    },

    async updateService(id: string, updates: Partial<ServiceRow>): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase
                .from(TABLE)
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error updating service:', err);
            return { success: false, error: err };
        }
    },

    async deleteService(id: string): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase.from(TABLE).delete().eq('id', id);
            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error deleting service:', err);
            return { success: false, error: err };
        }
    },

    async replaceAll(services: Omit<ServiceRow, 'id' | 'created_at'>[]): Promise<{ success: boolean; error?: any }> {
        try {
            const { error: delErr } = await supabase.from(TABLE).delete().gte('created_at', '1970-01-01');
            if (delErr && delErr.code !== '42P01') throw delErr;

            if (services.length > 0) {
                const { error: insErr } = await supabase.from(TABLE).insert(services);
                if (insErr) throw insErr;
            }
            return { success: true };
        } catch (err) {
            console.error('Error replacing services:', err);
            return { success: false, error: err };
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.services (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  title text NOT NULL,\n  description text,\n  price_range text,\n  icon text,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseServicesService;
