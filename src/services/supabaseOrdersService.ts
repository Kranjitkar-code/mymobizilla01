import { supabase } from '@/integrations/supabase/client';

export interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  device_brand: string;
  device_model: string;
  service_type: string;
  issues: string;
  additional_details: string | null;
  status: string;
  booking_ref: string;
  created_at: string;
}

export const SupabaseOrdersService = {
  async getAllOrders(): Promise<OrderRow[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        return [];
      }
      return (data as OrderRow[]) ?? [];
    } catch (error) {
      console.error('Orders fetch error:', error);
      return [];
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async getOrderByRef(bookingRef: string): Promise<OrderRow | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('booking_ref', bookingRef)
      .maybeSingle();

    if (error) return null;
    return data as OrderRow | null;
  },
};

export default SupabaseOrdersService;
