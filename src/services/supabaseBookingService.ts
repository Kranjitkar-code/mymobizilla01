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

function calculateEstimatedCost(data: RepairFormData): number {
  const baseCosts: Record<string, number> = {
    smartphone: 1500, laptop: 3000, tablet: 2000, desktop: 2500,
    smartwatch: 1000, console: 2000, camera: 2500, other: 1500,
  };
  const base = baseCosts[data.device_category?.toLowerCase()] || 1500;

  const multipliers: Record<string, number> = {
    screen: 1.2, battery: 0.8, water: 1.5, software: 0.6,
    charging: 0.7, speaker: 0.9, camera: 1.1, motherboard: 2.0,
  };
  let mult = 1.0;
  const issue = (data.issue || '').toLowerCase();
  for (const [key, val] of Object.entries(multipliers)) {
    if (issue.includes(key)) { mult = val; break; }
  }
  return Math.round(base * mult);
}

export interface BookingRecord {
  id: string;
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description: string | null;
  tracking_code: string;
  estimated_cost: number;
  status: string;
  created_at: string;
  updated_at: string;
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

      if (error) {
        console.error('Error looking up booking by ref:', error);
        return null;
      }
      return (data as BookingRecord) || null;
    } catch (err) {
      console.error('Error looking up booking:', err);
      return null;
    }
  },

  async getBookingsByPhone(phone: string): Promise<BookingRecord[]> {
    try {
      const cleaned = phone.replace(/[\s\-()]/g, '');
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .or(`customer_phone.ilike.%${cleaned}%,customer_phone.ilike.%${phone.trim()}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error looking up bookings by phone:', error);
        return [];
      }
      return (data as BookingRecord[]) || [];
    } catch (err) {
      console.error('Error looking up bookings by phone:', err);
      return [];
    }
  },

  async createBooking(data: RepairFormData): Promise<BookingResult> {
    const bookingRef = generateBookingRef();
    const estimatedCost = calculateEstimatedCost(data);

    try {
      const { error } = await supabase.from(TABLE).insert({
        device_category: data.device_category,
        brand: data.brand,
        model: data.model,
        issue: data.issue,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        description: data.description ?? null,
        tracking_code: bookingRef,
        estimated_cost: estimatedCost,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        if (error.code === '42P01') {
          console.warn('repair_orders table does not exist yet.');
          return { success: false, error: 'Table not found' };
        }
        throw error;
      }

      console.log('✅ Booking saved to Supabase:', bookingRef);
      return { success: true, bookingRef };
    } catch (err: any) {
      console.error('❌ Supabase booking insert failed:', err);
      return { success: false, error: err?.message || 'Unknown error' };
    }
  },
};

export default SupabaseBookingService;
