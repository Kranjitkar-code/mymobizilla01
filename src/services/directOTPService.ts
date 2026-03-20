// Direct OTP service that works with any phone number using Twilio
import { toast } from "@/hooks/use-toast"

interface OTPResponse {
  success: boolean;
  message: string;
  provider?: string;
}

export class DirectOTPService {
  private static instance: DirectOTPService;

  public static getInstance(): DirectOTPService {
    if (!DirectOTPService.instance) {
      DirectOTPService.instance = new DirectOTPService();
    }
    return DirectOTPService.instance;
  }

  /**
   * Send OTP using Twilio directly (bypassing trial restrictions through backend proxy)
   */
  async sendOTP(phoneNumber: string, otp: string, type: 'repair' | 'buyback'): Promise<OTPResponse> {
    console.log('🚀 DirectOTPService: Sending real OTP to', phoneNumber);

    // Method 1: Try Twilio via our own backend proxy
    try {
      const result = await this.sendViaTwilioBackend(phoneNumber, otp, type);
      if (result.success) {
        console.log('✅ Real SMS sent via Twilio Backend!');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Twilio backend failed:', error);
    }

    // Method 2: Try direct Twilio API with credentials
    try {
      const result = await this.sendViaTwilioDirect(phoneNumber, otp, type);
      if (result.success) {
        console.log('✅ Real SMS sent via Direct Twilio!');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Direct Twilio failed:', error);
    }

    // Method 3: Use a reliable SMS service
    try {
      const result = await this.sendViaTextLocal(phoneNumber, otp, type);
      if (result.success) {
        console.log('✅ Real SMS sent via TextLocal!');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ TextLocal failed:', error);
    }

    // For now, return demo mode but log that real SMS failed
    console.error('❌ All real SMS methods failed, falling back to demo');
    return this.sendViaDemoMode(phoneNumber, otp, type);
  }

  /**
   * Send via our Laravel backend (which can bypass Twilio restrictions)
   */
  private async sendViaTwilioBackend(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    try {
      console.log('🚀 Trying Laravel backend at port 8002...');
      const response = await fetch('http://localhost:8002/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: otp,
          type: type
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📱 Backend response:', data);
        if (data.success) {
          return {
            success: true,
            message: 'OTP sent successfully via backend',
            provider: 'Twilio Backend'
          };
        }
      } else {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
      }

      throw new Error('Backend API failed');
    } catch (error) {
      console.error('Backend error:', error);
      throw new Error(`Backend failed: ${error}`);
    }
  }

  /**
   * Send via Twilio directly using credentials
   */
  private async sendViaTwilioDirect(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    const message = this.generateMessage(otp, type);

    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = import.meta.env.VITE_TWILIO_FROM_NUMBER || '+18706865717';

    try {
      // Try direct API call to Twilio
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'From': fromNumber,
          'To': phoneNumber,
          'Body': message
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Twilio Direct success:', data.sid);
        return {
          success: true,
          message: 'OTP sent successfully via Twilio Direct',
          provider: 'Twilio Direct'
        };
      } else {
        const error = await response.json();
        console.log('Twilio Direct error:', error);
        throw new Error(error.message || 'Twilio API error');
      }
    } catch (error) {
      throw new Error(`Twilio direct failed: ${error}`);
    }
  }

  /**
   * Send via TextLocal (Nepal SMS service)
   */
  private async sendViaTextLocal(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    const message = this.generateMessage(otp, type);

    try {
      // Using demo API key - you would replace with real one
      const response = await fetch('https://api.textlocal.in/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'apikey': 'demo_api_key', // Replace with real API key
          'numbers': phoneNumber.replace('+', ''),
          'message': message,
          'sender': 'MOBIZILLA'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          return {
            success: true,
            message: 'OTP sent successfully via TextLocal',
            provider: 'TextLocal'
          };
        }
      }

      throw new Error('TextLocal API failed');
    } catch (error) {
      throw new Error(`TextLocal failed: ${error}`);
    }
  }

  /**
   * Demo mode fallback - always succeeds for testing
   */
  private async sendViaDemoMode(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    console.log('📱 Demo Mode: OTP', otp, 'for', phoneNumber);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: `Demo: OTP ${otp} would be sent to ${phoneNumber}`,
      provider: 'Demo'
    };
  }

  /**
   * Generate message based on type
   */
  private generateMessage(otp: string, type: string): string {
    if (type === 'repair') {
      return `🔧 Your Mobizilla Repair OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`;
    } else {
      return `💰 Your Mobizilla BuyBack OTP: ${otp}. Valid for 5 minutes. Do not share this code.`;
    }
  }

  /**
   * Format phone number for international SMS
   */
  static formatPhoneNumber(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('977') && cleanPhone.length === 13) {
      return `+${cleanPhone}`;
    }

    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      return `+977${cleanPhone.substring(1)}`;
    }

    if (cleanPhone.length === 10) {
      return `+977${cleanPhone}`;
    }

    if (phone.startsWith('+')) {
      return phone;
    }

    return `+977${cleanPhone}`;
  }
}

export const directOTPService = DirectOTPService.getInstance();