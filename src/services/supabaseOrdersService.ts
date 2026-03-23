import { supabase } from '@/integrations/supabase/client';

const TABLE = 'repair_orders';

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
  admin_notes?: string | null;
  technician_name?: string | null;
}

function mapRepairRow(row: Record<string, unknown>): OrderRow {
  return {
    id: String(row.id),
    customer_name: String(row.customer_name ?? ''),
    customer_email: String(row.customer_email ?? ''),
    customer_phone: String(row.customer_phone ?? ''),
    customer_address: (row.city as string | null | undefined) ?? null,
    device_brand: String(row.brand ?? ''),
    device_model: String(row.model ?? ''),
    service_type: String(row.service_type ?? 'repair'),
    issues: String(row.issue ?? ''),
    additional_details: row.description != null ? String(row.description) : null,
    status: String(row.status ?? 'pending'),
    booking_ref: String(row.tracking_code ?? ''),
    created_at: String(row.created_at ?? ''),
    admin_notes: (row.admin_notes as string | null | undefined) ?? null,
    technician_name: (row.technician_name as string | null | undefined) ?? null,
  };
}

export const SupabaseOrdersService = {
  async getAllOrders(): Promise<OrderRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        return [];
      }
      return ((data as Record<string, unknown>[]) ?? []).map(mapRepairRow);
    } catch (error) {
      console.error('Orders fetch error:', error);
      return [];
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase.from(TABLE).update({ status }).eq('id', id);

    if (error) throw error;
    return true;
  },

  async updateOrderFields(
    id: string,
    fields: Partial<Pick<OrderRow, 'status' | 'admin_notes' | 'technician_name'>>,
  ): Promise<void> {
    const { error } = await supabase.from(TABLE).update(fields).eq('id', id);
    if (error) throw error;
  },

  async getOrderByRef(bookingRef: string): Promise<OrderRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .ilike('tracking_code', bookingRef)
      .maybeSingle();

    if (error) return null;
    if (!data) return null;
    return mapRepairRow(data as Record<string, unknown>);
  },
};

export default SupabaseOrdersService;
