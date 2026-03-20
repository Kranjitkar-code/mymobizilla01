import { supabase } from '@/integrations/supabase/client';

const BOOKINGS_TABLE = 'repair_orders';

export interface BookingData {
  id?: string;
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description?: string;
  tracking_code: string;
  estimated_cost: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BookingStats {
  totalBookings: number;
  repairBookings: number;
  buybackBookings: number;
  pendingBookings: number;
  completedBookings: number;
  todayBookings: number;
  thisWeekBookings: number;
  thisMonthBookings: number;
}

export class BookingsService {
  /**
   * Sync a booking to Supabase
   */
  static async syncBooking(booking: BookingData): Promise<void> {
    try {
      const { error } = await supabase.from(BOOKINGS_TABLE).insert({
        device_category: booking.device_category,
        brand: booking.brand,
        model: booking.model,
        issue: booking.issue,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        description: booking.description ?? null,
        tracking_code: booking.tracking_code,
        estimated_cost: booking.estimated_cost,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.updated_at
      });

      if (error) throw error;
      console.log('✅ Booking synced to Supabase:', booking.tracking_code);
    } catch (error) {
      console.error('❌ Error syncing booking to Supabase:', error);
      throw error;
    }
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats(): Promise<BookingStats> {
    try {
      const { data, error } = await supabase.from(BOOKINGS_TABLE).select('*');
      if (error) throw error;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      let totalBookings = 0;
      let repairBookings = 0;
      let buybackBookings = 0;
      let pendingBookings = 0;
      let completedBookings = 0;
      let todayBookings = 0;
      let thisWeekBookings = 0;
      let thisMonthBookings = 0;
      
      (data || []).forEach((row) => {
        totalBookings++;
        
        // Determine if repair or buyback
        const issue = row.issue?.toLowerCase() || '';
        if (issue.includes('buyback')) {
          buybackBookings++;
        } else {
          repairBookings++;
        }
        
        // Count by status
        if (row.status === 'pending') pendingBookings++;
        if (row.status === 'completed') completedBookings++;
        
        // Count by date
        const createdAt = row.created_at ? new Date(row.created_at) : new Date(0);
        if (createdAt >= todayStart) todayBookings++;
        if (createdAt >= weekStart) thisWeekBookings++;
        if (createdAt >= monthStart) thisMonthBookings++;
      });
      
      return {
        totalBookings,
        repairBookings,
        buybackBookings,
        pendingBookings,
        completedBookings,
        todayBookings,
        thisWeekBookings,
        thisMonthBookings
      };
    } catch (error) {
      console.error('❌ Error getting booking stats from Supabase:', error);
      return {
        totalBookings: 0,
        repairBookings: 0,
        buybackBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        todayBookings: 0,
        thisWeekBookings: 0,
        thisMonthBookings: 0
      };
    }
  }

  /**
   * Subscribe to real-time booking stats
   */
  static subscribeToBookingStats(callback: (stats: BookingStats) => void): () => void {
    try {
      const channel = supabase
        .channel('realtime:repair_orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: BOOKINGS_TABLE }, async () => {
          const stats = await BookingsService.getBookingStats();
          callback(stats);
        })
        .subscribe();

      BookingsService.getBookingStats().then(callback).catch(err => {
        console.error('Initial booking stats load failed:', err);
      });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error subscribing to booking stats via Supabase:', error);
      return () => {};
    }
  }
}
