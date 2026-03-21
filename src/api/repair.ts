import { localRepairAPI, type RepairFormData, type RepairOrder } from './local-repair';
import SupabaseBookingService from '@/services/supabaseBookingService';

export type { RepairFormData, RepairOrder };

export const repairAPI = {
  ...localRepairAPI,

  async createBooking(data: RepairFormData): Promise<{
    success: boolean;
    tracking_code?: string;
    bookingRef?: string;
    error?: string;
    order?: RepairOrder;
    email_status?: any;
  }> {
    // Try Supabase first
    const sbResult = await SupabaseBookingService.createBooking(data);

    if (sbResult.success && sbResult.bookingRef) {
      console.log('✅ Booking saved to Supabase:', sbResult.bookingRef);

      // Still save locally as backup + trigger email
      const localResult = await localRepairAPI.createBooking(data);

      return {
        success: true,
        tracking_code: sbResult.bookingRef,
        bookingRef: sbResult.bookingRef,
        order: localResult.order,
        email_status: localResult.email_status,
      };
    }

    // Supabase failed — fall back to local storage
    console.warn('⚠️ Supabase booking failed, falling back to localStorage:', sbResult.error);
    const localResult = await localRepairAPI.createBooking(data);

    return {
      ...localResult,
      bookingRef: localResult.tracking_code,
    };
  },
};
