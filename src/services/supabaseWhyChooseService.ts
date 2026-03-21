import { supabase } from '@/integrations/supabase/client';

export interface WhyChooseRow {
    id: string;
    title: string;
    description: string | null;
    icon_url: string | null;
    created_at?: string;
}

const TABLE = 'why_choose_us';

export const SupabaseWhyChooseService = {
    async getAll(): Promise<WhyChooseRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Why Choose Us table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching why choose us:', error);
            return [];
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.why_choose_us (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  title text NOT NULL,\n  description text,\n  icon_url text,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseWhyChooseService;
