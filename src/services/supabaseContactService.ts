import { supabase } from '@/integrations/supabase/client';

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  status: string;
  created_at: string;
}

export const SupabaseContactService = {
  async submitMessage(data: {
    name: string;
    email: string;
    phone: string;
    interest: string;
    message: string;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
        message: data.message,
        status: 'unread',
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Contact message insert failed:', error);
      throw error;
    }
    return true;
  },

  async getAllMessages(): Promise<ContactMessageRow[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Contact messages fetch error:', error);
        return [];
      }
      return (data as ContactMessageRow[]) ?? [];
    } catch {
      return [];
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};

export default SupabaseContactService;
