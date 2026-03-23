import { supabase } from '@/integrations/supabase/client';
import type { RepairFormData } from '@/api/local-repair';

const TABLE = 'repair_orders';

export interface BookingResult {
  success: boolean;
  bookingRef?: string;
  error?: string;
}

function generateBookingRef(): string {
  return `MB-${Date.now().toString().slice(-6)}`;
}

export interface BookingRecord {
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

function rowToBookingRecord(row: Record<string, unknown>): BookingRecord {
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
  };
}

export const SupabaseBookingService = {
  async getBookingByRef(ref: string): Promise<BookingRecord | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .ilike('tracking_code', ref.trim())
        .limit(1)
        .maybeSingle();

      if (!error && data) return rowToBookingRecord(data as Record<string, unknown>);
    } catch { /* fall through */ }
    return null;
  },

  async getBookingsByPhone(phone: string): Promise<BookingRecord[]> {
    const cleaned = phone.replace(/[\s\-()]/g, '');

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .or(`customer_phone.ilike.%${cleaned}%,customer_phone.ilike.%${phone.trim()}%`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as Record<string, unknown>[]).map(rowToBookingRecord);
      }
    } catch { /* fall through */ }
    return [];
  },

  async createBooking(data: RepairFormData): Promise<BookingResult> {
    const bookingRef = generateBookingRef();

    const descLower = (data.description || '').toLowerCase();
    const isBuyback = descLower.includes('service type: buyback') || data.issue === 'DEVICE BUYBACK REQUEST';
    const serviceType = isBuyback ? 'buyback' : 'repair';

    try {
      const { error } = await supabase.from(TABLE).insert({
        device_category: data.device_category || 'other',
        brand: data.brand,
        model: data.model,
        issue: data.issue,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        description: data.description ?? null,
        tracking_code: bookingRef,
        estimated_cost: 0,
        status: 'pending',
        service_type: serviceType,
      });

      if (error) {
        if (error.code === '42P01') {
          console.warn('repair_orders table does not exist yet.');
          return { success: false, error: 'Table not found' };
        }
        throw error;
      }

      return { success: true, bookingRef };
    } catch (err: any) {
      console.error('Supabase booking insert failed:', err);
      return { success: false, error: err?.message || 'Unknown error' };
    }
  },
};

export default SupabaseBookingService;
