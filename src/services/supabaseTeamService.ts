import { supabase } from '@/integrations/supabase/client';

export interface TeamMemberRow {
    id: string;
    name: string;
    role: string | null;
    bio: string | null;
    photo_url: string | null;
    created_at?: string;
}

const TABLE = 'team_members';

export const SupabaseTeamService = {
    async getAll(): Promise<TeamMemberRow[]> {
        try {
            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    console.warn('Team members table does not exist yet.');
                    return [];
                }
                throw error;
            }
            return (data as any) || [];
        } catch (error) {
            console.error('Error fetching team members:', error);
            return [];
        }
    },

    async ensureSchema(): Promise<{ success: boolean; message?: string }> {
        try {
            const { error } = await supabase.from(TABLE).select('id').limit(1);
            if (error) {
                const sql = `-- Run in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.team_members (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  name text NOT NULL,\n  role text,\n  bio text,\n  photo_url text,\n  created_at timestamptz DEFAULT now()\n);`;
                console.log(sql);
                return { success: false, message: 'Table missing. SQL logged.' };
            }
            return { success: true };
        } catch (e) {
            return { success: false, message: String(e) };
        }
    }
};

export default SupabaseTeamService;
