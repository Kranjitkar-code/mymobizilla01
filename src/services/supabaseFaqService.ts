import { supabase } from '@/integrations/supabase/client';

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
    display_order: number;
    created_at?: string;
}

const TABLE = 'faqs';

export const SupabaseFaqService = {
    async getAllFaqs(): Promise<FaqItem[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('FAQs table does not exist.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return [];
        }
    },

    async addFaq(faq: Omit<FaqItem, 'id' | 'created_at'>): Promise<{ success: boolean; row?: FaqItem; error?: any }> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .insert([faq])
                .select()
                .single();

            if (error) throw error;
            return { success: true, row: data as FaqItem };
        } catch (err) {
            console.error('Error adding FAQ:', err);
            return { success: false, error: err };
        }
    },

    async updateFaq(id: string, updates: Partial<FaqItem>): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase
                .from(TABLE)
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error updating FAQ:', err);
            return { success: false, error: err };
        }
    },

    async deleteFaq(id: string): Promise<{ success: boolean; error?: any }> {
        try {
            const { error } = await supabase.from(TABLE).delete().eq('id', id);
            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('Error deleting FAQ:', err);
            return { success: false, error: err };
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.faqs (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  question text NOT NULL,\n  answer text NOT NULL,\n  display_order integer DEFAULT 0,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseFaqService;
