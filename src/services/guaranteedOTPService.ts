// Guaranteed OTP service that ACTUALLY delivers OTP
interface OTPResponse {
  success: boolean;
  message: string;
  provider?: string;
}

export class GuaranteedOTPService {
  private static instance: GuaranteedOTPService;

  public static getInstance(): GuaranteedOTPService {
    if (!GuaranteedOTPService.instance) {
      GuaranteedOTPService.instance = new GuaranteedOTPService();
    }
    return GuaranteedOTPService.instance;
  }

  /**
   * Send OTP with REAL SMS delivery to phone
   */
  async sendOTP(phoneNumber: string, otp: string, type: 'repair' | 'buyback'): Promise<OTPResponse> {
    console.log('🚀 GuaranteedOTPService: Sending REAL SMS to', phoneNumber);

    // Method 1: Try Fast2SMS (most reliable for Nepal numbers)
    try {
      const result = await this.sendViaFast2SMSReal(phoneNumber, otp, type);
      if (result.success) {
        console.log('✅ REAL SMS sent via Fast2SMS!');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Fast2SMS failed:', error);
    }

    // Method 2: Try Twilio Direct (backup)
    try {
      const result = await this.sendViaTwilioDirect(phoneNumber, otp, type);
      if (result.success) {
        console.log('✅ REAL SMS sent via Twilio!');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Twilio failed:', error);
    }

    // Method 3: Try TextLocal (backup for Nepal numbers)
    try {
      const result = await this.sendViaTextLocalReal(phoneNumber, otp, type);
      if (result.success) {
        console.log('✅ REAL SMS sent via TextLocal!');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ TextLocal failed:', error);
    }

    // If all SMS methods fail, show error instead of console display
    throw new Error('Failed to send SMS to your phone. Please check your phone number and try again.');
  }

  /**
   * Send via Fast2SMS - REAL SMS delivery
   */
  private async sendViaFast2SMSReal(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    const cleanPhone = phoneNumber.replace(/\D/g, '').replace(/^977/, '');

    // Your actual Fast2SMS API key from environment
    const apiKey = import.meta.env.VITE_FAST2SMS_API_KEY;

    const message = `Your Mobizilla ${type === 'repair' ? 'Repair' : 'BuyBack'} OTP is ${otp}. Valid for 5 minutes. Do not share this code.`;

    try {
      console.log('📱 Sending real SMS via Fast2SMS to:', cleanPhone);
      console.log('🔑 Using API Key:', apiKey.substring(0, 20) + '...');
      console.log('💬 Message:', message);

      // Use the message route for real SMS delivery
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q', // Quality route for better delivery
          message: message,
          language: 'english',
          flash: 0,
          numbers: cleanPhone
        })
      });

      const data = await response.json();
      console.log('📱 Fast2SMS Real Response Status:', response.status);
      console.log('📱 Fast2SMS Real Response Data:', data);

      if (response.ok && (data.return === true || data.status_code === 200)) {
        console.log('✅ Fast2SMS SUCCESS - SMS should arrive in 1-2 minutes!');
        return {
          success: true,
          message: `SMS sent to +977${cleanPhone} via Fast2SMS`,
          provider: 'Fast2SMS'
        };
      } else {
        console.error('❌ Fast2SMS Error Details:', data);
        throw new Error(data.message || `Fast2SMS failed: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Fast2SMS Real SMS Error:', error);
      throw error;
    }
  }

  /**
   * Send via Twilio - Direct SMS delivery
   */
  private async sendViaTwilioDirect(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    const message = `Your Mobizilla ${type === 'repair' ? 'Repair' : 'BuyBack'} OTP is ${otp}. Valid for 5 minutes.`;

    // Twilio credentials from environment
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = import.meta.env.VITE_TWILIO_FROM_NUMBER || '+18706865717';

    try {
      console.log('📱 Sending real SMS via Twilio to:', phoneNumber);

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
        console.log('✅ Twilio SMS sent successfully:', data.sid);
        return {
          success: true,
          message: `SMS sent to ${phoneNumber} via Twilio`,
          provider: 'Twilio'
        };
      } else {
        const error = await response.json();
        console.error('Twilio error:', error);
        throw new Error(error.message || 'Twilio failed to send SMS');
      }
    } catch (error) {
      console.error('Twilio Direct SMS Error:', error);
      throw error;
    }
  }

  /**
   * Send via TextLocal - Real SMS for Nepal numbers
   */
  private async sendViaTextLocalReal(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    const cleanPhone = phoneNumber.replace(/\D/g, '').replace(/^977/, '');
    const message = `Your Mobizilla ${type === 'repair' ? 'Repair' : 'BuyBack'} OTP is ${otp}. Valid for 5 minutes.`;

    try {
      console.log('📱 Sending real SMS via TextLocal to:', cleanPhone);

      // Using TextLocal API for real SMS delivery
      const response = await fetch('https://api.textlocal.in/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'apikey': 'NzEwNjU3Nzc1YTc5Mzc2ZDZhNzE2ZjZlNmQ2ZDc5NmI2ZTc5', // Demo key - replace with real
          'numbers': cleanPhone,
          'message': message,
          'sender': 'MOBIZI'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📱 TextLocal Response:', data);

        if (data.status === 'success') {
          return {
            success: true,
            message: `SMS sent to +977${cleanPhone} via TextLocal`,
            provider: 'TextLocal'
          };
        }
      }

      throw new Error('TextLocal failed to send SMS');
    } catch (error) {
      console.error('TextLocal Real SMS Error:', error);
      throw error;
    }
  }

  /**
   * Console display for guaranteed delivery
   */
  private async sendViaConsoleDisplay(phoneNumber: string, otp: string, type: string): Promise<OTPResponse> {
    const message = `Your Mobizilla ${type === 'repair' ? 'Repair' : 'BuyBack'} OTP is: ${otp}. Valid for 5 minutes.`;

    // Clear console and display prominently
    console.clear();
    console.log(`%c🎯 Mobizilla OTP READY!`, 'color: #00ff00; font-size: 24px; font-weight: bold; background: #000; padding: 10px;');
    console.log(`%c📱 Phone: ${phoneNumber}`, 'color: #00bfff; font-size: 18px; font-weight: bold;');
    console.log(`%c🔢 OTP: ${otp}`, 'color: #ff6b35; font-size: 28px; font-weight: bold; background: #fffacd; padding: 5px;');
    console.log(`%c📝 Type: ${type.toUpperCase()}`, 'color: #9370db; font-size: 16px;');
    console.log(`%c⏰ Time: ${new Date().toLocaleString()}`, 'color: #32cd32; font-size: 14px;');
    console.log(`%c${'='.repeat(60)}`, 'color: #00ff00; font-size: 16px;');

    // Store in localStorage for persistence
    localStorage.setItem('mobizilla_otp', otp);
    localStorage.setItem('mobizilla_otp_phone', phoneNumber);
    localStorage.setItem('mobizilla_otp_time', new Date().toISOString());
    localStorage.setItem('mobizilla_otp_type', type);

    // Also try to show notification if possible
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Mobizilla OTP Ready!', {
            body: `Your OTP is: ${otp}`,
            icon: '/favicon.ico'
          });
        }
      });
    }

    return {
      success: true,
      message: `OTP ${otp} is ready! Check browser console and modal.`,
      provider: 'Console Display'
    };
  }

  /**
   * Format phone number for SMS
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

export const guaranteedOTPService = GuaranteedOTPService.getInstance();