import { supabase } from '@/integrations/supabase/client';

export interface VideoRow {
    id: string;
    title: string;
    video_url: string;
    description: string | null;
    thumbnail_url: string | null;
    created_at?: string;
}

const TABLE = 'video_lists';

export const SupabaseVideosService = {
    async getAll(): Promise<VideoRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Videos table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.videos (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  title text NOT NULL,\n  video_url text NOT NULL,\n  description text,\n  thumbnail_url text,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseVideosService;
