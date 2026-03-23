import { supabase } from '@/integrations/supabase/client';
import type { RepairFormData } from '@/api/local-repair';

const TABLE = 'orders';

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

export const SupabaseBookingService = {
  async getBookingByRef(ref: string): Promise<BookingRecord | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .ilike('booking_ref', ref.trim())
        .limit(1)
        .maybeSingle();

      if (!error && data) return data as BookingRecord;
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

      if (!error && data && data.length > 0) return data as BookingRecord[];
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
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_address: null,
        device_brand: data.brand,
        device_model: data.model,
        service_type: serviceType,
        issues: data.issue,
        additional_details: data.description ?? null,
        status: 'pending',
        booking_ref: bookingRef,
        created_at: new Date().toISOString(),
      });

      if (error) {
        if (error.code === '42P01') {
          console.warn('orders table does not exist yet.');
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
