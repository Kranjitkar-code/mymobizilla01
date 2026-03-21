import { supabase } from '@/integrations/supabase/client';

export interface TestimonialRow {
    id: string;
    name: string;
    content: string | null;
    rating: number | null;
    image_url: string | null;
    created_at?: string;
}

const TABLE = 'testimonials';

export const SupabaseTestimonialsService = {
    async getAll(): Promise<TestimonialRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Testimonials table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.testimonials (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  name text NOT NULL,\n  content text,\n  rating integer,\n  image_url text,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseTestimonialsService;
