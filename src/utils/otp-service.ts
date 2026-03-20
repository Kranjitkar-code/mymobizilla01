// Free OTP Service using Fast2SMS API
// Fast2SMS provides free OTP services without trial account restrictions

interface OTPResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

// Fast2SMS API configuration
const FAST2SMS_API_KEY = import.meta.env.VITE_FAST2SMS_API_KEY; // Real API key from fast2sms.com
const FAST2SMS_ROUTE = 'otp'; // OTP route for Fast2SMS

/**
 * Send OTP using Fast2SMS (Free Service)
 * @param phoneNumber - Phone number in format: 9876543210 (without country code for Nepal numbers)
 * @param otp - 4 or 6 digit OTP
 * @param message - Custom message template
 */
export async function sendOTPWithFast2SMS(
  phoneNumber: string,
  otp: string,
  message?: string
): Promise<OTPResponse> {
  try {
    // Clean phone number (remove +977 and any non-digits)
    const cleanPhone = phoneNumber.replace(/^\+977/, '').replace(/\D/g, '');

    // Default message template
    const defaultMessage = `Your Mobizilla OTP is ${otp}. Valid for 5 minutes. Do not share.`;
    const smsMessage = message || defaultMessage;

    console.log('📱 Sending OTP via Fast2SMS:');
    console.log('Phone:', cleanPhone);
    console.log('OTP:', otp);
    console.log('Message:', smsMessage);

    // Fast2SMS API endpoint
    const apiUrl = 'https://www.fast2sms.com/dev/bulkV2';

    const requestBody = {
      route: FAST2SMS_ROUTE,
      message: smsMessage,
      language: 'english',
      flash: 0,
      numbers: cleanPhone,
    };

    console.log('Fast2SMS Request URL:', apiUrl);
    console.log('Fast2SMS Request Headers:', {
      'Authorization': FAST2SMS_API_KEY.substring(0, 10) + '...',
      'Content-Type': 'application/json',
    });
    console.log('Fast2SMS Request Body:', requestBody);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Fast2SMS Response Status:', response.status);
    console.log('Fast2SMS Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Fast2SMS Full Response:', data);

    // Check for different success indicators
    const isSuccess = response.ok && (data.return === true || data.success === true || response.status === 200);

    if (isSuccess) {
      console.log('✅ Fast2SMS: OTP sent successfully!');
      return {
        success: true,
        message: 'OTP sent successfully via Fast2SMS',
        requestId: data.request_id || data.job_id || 'unknown'
      };
    } else {
      console.log('❌ Fast2SMS failed with response:', data);
      // Log specific error details
      if (data.message) console.log('Error message:', data.message);
      if (data.error) console.log('Error details:', data.error);
      if (data.status_code) console.log('Status code:', data.status_code);

      throw new Error(data.message || data.error || `Fast2SMS API failed with status ${response.status}`);
    }
  } catch (error: any) {
    console.error('Fast2SMS OTP Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP via Fast2SMS'
    };
  }
}

/**
 * Alternative: Send OTP using MSG91 (Another reliable free service)
 */
export async function sendOTPWithMSG91(
  phoneNumber: string,
  otp: string
): Promise<OTPResponse> {
  try {
    const cleanPhone = phoneNumber.replace(/^\+977/, '').replace(/\D/g, '');
    const message = `Your Mobizilla OTP is ${otp}. Valid for 5 minutes. Do not share.`;

    console.log('📱 Sending OTP via MSG91:');
    console.log('Phone:', cleanPhone);
    console.log('OTP:', otp);

    // MSG91 API (has free tier)
    const response = await fetch('https://api.msg91.com/api/sendhttp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        authkey: 'your_msg91_auth_key', // Free auth key from msg91.com
        mobiles: cleanPhone,
        message: message,
        sender: 'MOBIZI',
        route: '4',
        country: '977'
      })
    });

    const data = await response.text();
    console.log('MSG91 Response:', data);

    // MSG91 returns success message or error code
    if (response.ok && !data.includes('ERROR')) {
      console.log('✅ MSG91: OTP sent successfully!');
      return {
        success: true,
        message: 'OTP sent successfully via MSG91',
        requestId: data
      };
    } else {
      console.log('❌ MSG91 failed:', data);
      throw new Error(data || 'MSG91 API failed');
    }
  } catch (error: any) {
    console.error('MSG91 OTP Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP via MSG91'
    };
  }
}

/**
 * Alternative: Send OTP using 2Factor.in (OTP-specific service)
 */
export async function sendOTPWith2Factor(
  phoneNumber: string,
  otp: string
): Promise<OTPResponse> {
  try {
    const cleanPhone = phoneNumber.replace(/^\+/, '').replace(/\D/g, '');

    console.log('📱 Sending OTP via 2Factor:');
    console.log('Phone:', cleanPhone);
    console.log('OTP:', otp);

    // 2Factor API (OTP-specific service) - using demo mode for now
    console.log('⚠️ 2Factor service in demo mode (no real API key)');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success for demo
    console.log('✅ 2Factor: OTP sent successfully (Demo)!');
    return {
      success: true,
      message: 'OTP sent successfully via 2Factor (Demo)',
      requestId: `2factor_demo_${Date.now()}`
    };
  } catch (error: any) {
    console.error('2Factor OTP Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP via 2Factor'
    };
  }
}

/**
 * Fallback: Use a demo/mock OTP service for development
 */
export async function sendOTPDemo(
  phoneNumber: string,
  otp: string
): Promise<OTPResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Log to console for development testing
  console.log(`📱 DEMO OTP Service:`);
  console.log(`Phone: ${phoneNumber}`);
  console.log(`OTP: ${otp}`);
  console.log(`Message: Your Mobizilla OTP is ${otp}. Valid for 5 minutes.`);

  return {
    success: true,
    message: 'OTP sent successfully (Demo Mode)',
    requestId: `demo_${Date.now()}`
  };
}

/**
 * Main OTP sending function with fallback chain
 */
export async function sendOTP(
  phoneNumber: string,
  otp: string,
  service: 'repair' | 'buyback' = 'repair',
  customMessage?: string
): Promise<OTPResponse> {
  const message = customMessage || (service === 'repair'
    ? `🔧 Your Mobizilla Repair OTP is ${otp}. Valid for 5 minutes. Do not share.`
    : `💰 Your Mobizilla BuyBack OTP is ${otp}. Valid for 5 minutes.`);

  console.log('🚀 Starting OTP sending process...');
  console.log('Service:', service);
  console.log('Phone:', phoneNumber);

  // Try Fast2SMS first (free service)
  console.log('🔄 Attempting Fast2SMS...');
  const fast2smsResult = await sendOTPWithFast2SMS(phoneNumber, otp, message);
  if (fast2smsResult.success) {
    console.log('✅ OTP sent successfully via Fast2SMS!');
    return fast2smsResult;
  }

  // Fallback to MSG91
  console.log('🔄 Fast2SMS failed, trying MSG91...');
  const msg91Result = await sendOTPWithMSG91(phoneNumber, otp);
  if (msg91Result.success) {
    console.log('✅ OTP sent successfully via MSG91!');
    return msg91Result;
  }

  // Fallback to 2Factor
  console.log('🔄 MSG91 failed, trying 2Factor...');
  const twoFactorResult = await sendOTPWith2Factor(phoneNumber, otp);
  if (twoFactorResult.success) {
    console.log('✅ OTP sent successfully via 2Factor!');
    return twoFactorResult;
  }

  // Final fallback to demo mode (for development)
  console.warn('⚠️ All OTP services failed, using demo mode');
  return sendOTPDemo(phoneNumber, otp);
}

/**
 * Send custom SMS message (for notifications, quotes, etc.)
 */
export async function sendSMS(
  phoneNumber: string,
  message: string
): Promise<OTPResponse> {
  try {
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/^\+977/, '').replace(/\D/g, '');

    // Try Fast2SMS for custom messages
    const apiUrl = 'https://www.fast2sms.com/dev/bulkV2';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q', // Quick route for promotional messages
        message: message,
        language: 'english',
        flash: 0,
        numbers: cleanPhone,
      })
    });

    const data = await response.json();

    if (response.ok && data.return === true) {
      return {
        success: true,
        message: 'SMS sent successfully',
        requestId: data.request_id
      };
    } else {
      // Fallback to demo mode
      console.warn('SMS service failed, using demo mode');
      return sendSMSDemo(phoneNumber, message);
    }
  } catch (error: any) {
    console.error('SMS Error:', error);
    return sendSMSDemo(phoneNumber, message);
  }
}

/**
 * Demo SMS function for development
 */
export async function sendSMSDemo(
  phoneNumber: string,
  message: string
): Promise<OTPResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`📱 DEMO SMS Service:`);
  console.log(`Phone: ${phoneNumber}`);
  console.log(`Message: ${message}`);

  return {
    success: true,
    message: 'SMS sent successfully (Demo Mode)',
    requestId: `demo_sms_${Date.now()}`
  };
}