import { client } from './client';

interface BookingData {
  ID: string;
  'Service Type': string;
  'Device Category': string;
  Brand: string;
  Model: string;
  'Issue/Condition': string;
  'Customer Name': string;
  'Customer Email': string;
  'Customer Phone': string;
  'Quote Value': string;
  Description: string;
  'Submission Time': string;
}

interface BookingStats {
  total_bookings: number;
  repair_bookings: number;
  buyback_bookings: number;
}

interface BookingDataResponse {
  success: boolean;
  data?: BookingData[];
  message?: string;
  error?: string;
}

interface BookingStatsResponse {
  success: boolean;
  stats?: BookingStats;
  message?: string;
  error?: string;
}

// Interface for the data we send to store booking data
interface StoreBookingDataRequest {
  device_category: string;
  brand: string;
  model: string;
  issue?: string;
  condition?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  quote_value?: string;
  description?: string;
  service_type: 'repair' | 'buyback';
  submission_time: string;
}

interface StoreBookingDataResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const bookingDataAPI = {
  async getBookingData(): Promise<BookingDataResponse> {
    try {
      const response = await client.get<BookingDataResponse>('/booking-data');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching booking data:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch booking data'
      };
    }
  },

  async exportBookingData(): Promise<any> {
    try {
      const response = await client.get('/export-booking-data', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Error exporting booking data:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to export booking data');
    }
  },
  
  async getBookingStats(): Promise<BookingStatsResponse> {
    try {
      const response = await client.get<BookingStatsResponse>('/booking-stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching booking stats:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch booking stats'
      };
    }
  },
  
  async storeBookingData(data: StoreBookingDataRequest): Promise<StoreBookingDataResponse> {
    try {
      const response = await client.post<StoreBookingDataResponse>('/store-booking-data', data);
      return response.data;
    } catch (error: any) {
      console.error('Error storing booking data:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to store booking data'
      };
    }
  }
};