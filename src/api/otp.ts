import { client } from './client';

interface SendOTPRequest {
  phone_number: string;
  otp: string;
  type: 'repair' | 'buyback';
}

interface SendOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const otpAPI = {
  async sendOTP(phoneNumber: string, otp: string, type: 'repair' | 'buyback'): Promise<SendOTPResponse> {
    try {
      console.log('🚀 Sending OTP via backend API:', { phoneNumber, otp, type });
      
      const response = await client.post<SendOTPResponse>('/send-otp', {
        phone_number: phoneNumber,
        otp: otp,
        type: type
      });
      
      console.log('✅ OTP API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ OTP API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send OTP'
      };
    }
  }
};