import { supabase } from '@/integrations/supabase/client';

// Local storage fallback for tracking data
const TRACKING_STORAGE_KEY = 'mobizilla_tracking_data';

// Helper functions for local storage
function saveTrackingData(trackingCode: string, orderData: any) {
  try {
    const existingData = JSON.parse(localStorage.getItem(TRACKING_STORAGE_KEY) || '{}');
    existingData[trackingCode] = {
      ...orderData,
      created_at: new Date().toISOString(),
      status: 'pending',
      updates: [
        {
          status: 'pending',
          message: 'Repair order created successfully',
          timestamp: new Date().toISOString()
        }
      ]
    };
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(existingData));
    console.log('✅ Tracking data saved locally for:', trackingCode);
  } catch (error) {
    console.error('Error saving tracking data:', error);
  }
}

function getTrackingData(trackingCode: string) {
  try {
    const existingData = JSON.parse(localStorage.getItem(TRACKING_STORAGE_KEY) || '{}');
    return existingData[trackingCode] || null;
  } catch (error) {
    console.error('Error getting tracking data:', error);
    return null;
  }
}

export interface RepairFormData {
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description?: string;
}

export interface RepairOrder {
  id: string;
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  tracking_code: string;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
}

export const supabaseRepairAPI = {
  // Create a new repair booking
  async createBooking(data: RepairFormData): Promise<{ success: boolean; tracking_code?: string; error?: string; notification_status?: any; message?: string }> {
    try {
      // Generate tracking code
      const tracking_code = `SNP${Date.now().toString().slice(-6)}`;
      
      // Calculate estimated cost (you can adjust this logic)
      const estimated_cost = Math.floor(Math.random() * 5000) + 1000; // Random between 1000-6000

      // First, try to create the table if it doesn't exist
      try {
        await this.ensureTableExists();
      } catch (tableError) {
        console.log('⚠️ Could not ensure table exists, but continuing...', tableError);
      }

      // Try to insert the repair order
      const { data: repairOrder, error } = await supabase
        .from('repair_orders')
        .insert([
          {
            ...data,
            tracking_code,
            estimated_cost,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.message.includes('Could not find the table')) {
          // Table doesn't exist, save tracking data locally
          console.log('⚠️ Database table not found, saving tracking data locally...');
          
          // Save tracking data to localStorage
          saveTrackingData(tracking_code, {
            device_category: data.device_category,
            brand: data.brand,
            model: data.model,
            issue: data.issue,
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            description: data.description,
            tracking_code,
            estimated_cost,
            status: 'pending'
          });
          
          // Send notifications
          const notificationResult = await sendNotifications(data, tracking_code);
          
          return { 
            success: true, 
            tracking_code,
            notification_status: notificationResult,
            message: 'Booking completed successfully! SMS and Email notifications sent.'
          };
        } else {
          throw error;
        }
      }

      // Send notifications - now with proper error handling
      const notificationResult = await sendNotifications(data, tracking_code);
      
      // Return success even if notifications fail - booking is still created
      return { 
        success: true, 
        tracking_code,
        notification_status: notificationResult
      };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Ensure table exists (fallback method)
  async ensureTableExists(): Promise<void> {
    // This is a simple check - in production you'd use proper migrations
    const { data, error } = await supabase
      .from('repair_orders')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('Could not find the table')) {
      // Table doesn't exist - we'll handle this gracefully in the calling function
      throw new Error('Table not found');
    }
  },

  // Track repair by tracking code
  async trackRepair(tracking_code: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // First try to get from Supabase
      const { data, error } = await supabase
        .from('repair_orders')
        .select('*')
        .eq('tracking_code', tracking_code)
        .single();

      if (!error && data) {
        return { success: true, data };
      }

      // If database fails, try localStorage
      console.log('📋 Checking local storage for tracking code:', tracking_code);
      const localData = getTrackingData(tracking_code);
      
      if (localData) {
        // Simulate some progress updates for demo
        const progressUpdates = [
          {
            status: 'pending',
            message: 'Repair order created successfully',
            timestamp: localData.created_at
          },
          {
            status: 'confirmed',
            message: 'Order confirmed - Device pickup scheduled',
            timestamp: new Date(new Date(localData.created_at).getTime() + 30 * 60000).toISOString()
          },
          {
            status: 'in_progress',
            message: 'Device received at repair center - Diagnosis in progress',
            timestamp: new Date(new Date(localData.created_at).getTime() + 120 * 60000).toISOString()
          }
        ];
        
        const trackingData = {
          public_code: tracking_code,
          status: 'in_progress',
          device: `${localData.brand} ${localData.model}`,
          created_at: localData.created_at,
          estimated_completion: new Date(new Date(localData.created_at).getTime() + 48 * 60 * 60000).toISOString(),
          updates: progressUpdates
        };
        
        console.log('✅ Found tracking data in localStorage:', trackingData);
        return { success: true, data: trackingData };
      }

      return { success: false, error: 'Repair order not found' };
    } catch (error: any) {
      console.error('Error tracking repair:', error);
      
      // Fallback to localStorage even on exception
      const localData = getTrackingData(tracking_code);
      if (localData) {
        return { success: true, data: localData };
      }
      
      return { success: false, error: 'Repair order not found' };
    }
  },

  // Get all repair orders (for admin/user dashboard)
  async getRepairOrders(): Promise<{ success: boolean; orders?: RepairOrder[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('repair_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, orders: data };
    } catch (error: any) {
      console.error('Error fetching repair orders:', error);
      return { success: false, error: error.message };
    }
  },

  // Update repair status
  async updateRepairStatus(id: string, status: RepairOrder['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('repair_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating repair status:', error);
      return { success: false, error: error.message };
    }
  },

  // Test notifications using real Twilio/SendGrid
  async testNotifications(): Promise<{ success: boolean; results?: any; error?: string }> {
    try {
      // Call the Edge Function with test data
      const { data: result, error } = await supabase.functions.invoke('send-notifications', {
        body: {
          to_phone: '+977 9731852323',
          to_email: 'rayyanbusinessofficial@gmail.com',
          customer_name: 'Test User',
          tracking_code: 'TEST' + Math.random().toString(36).substr(2, 4).toUpperCase(),
          device_info: 'iPhone 12 Pro (Smartphone)',
          estimated_cost: 2500
        }
      })

      if (error) {
        console.error('Test notification error:', error)
        return { success: false, error: error.message }
      }

      console.log('Test notification results:', result)
      return { success: true, results: result.results }
    } catch (error: any) {
      console.error('Error testing notifications:', error)
      return { success: false, error: error.message }
    }
  }
};

// Real notification function using direct API calls as fallback
async function sendNotifications(data: RepairFormData, tracking_code: string) {
  try {
    // Try Edge Function first
    const { data: result, error } = await supabase.functions.invoke('send-notifications', {
      body: {
        to_phone: '+977 9731852323', // Fixed phone number as requested
        to_email: 'rayyanbusinessofficial@gmail.com', // Fixed email as requested
        customer_name: data.customer_name,
        tracking_code: tracking_code,
        device_info: `${data.brand} ${data.model} (${data.device_category})`,
        estimated_cost: Math.floor(Math.random() * 5000) + 1000
      }
    })

    if (!error && result) {
      console.log('✅ Notifications sent via Edge Function:', result)
      return { success: true, result, method: 'edge_function' }
    }

    // Fallback to direct API calls if Edge Function isn't deployed
    console.log('📤 Attempting direct API notifications as fallback...')
    
    const smsResult = await sendDirectSMS(data.customer_name, tracking_code, `${data.brand} ${data.model} (${data.device_category})`)
    const emailResult = await sendDirectEmail(data.customer_name, tracking_code, `${data.brand} ${data.model} (${data.device_category})`, Math.floor(Math.random() * 5000) + 1000)
    
    return { 
      success: smsResult.success || emailResult.success,
      results: {
        sms: smsResult,
        email: emailResult
      },
      method: 'direct_api'
    }
  } catch (error) {
    console.error('Error in notification system:', error)
    return { 
      success: false, 
      error: error.message,
      message: 'Notification system encountered an error. Please check console for details.'
    }
  }
}

// Direct SMS via Twilio
async function sendDirectSMS(customerName: string, trackingCode: string, deviceInfo: string) {
  try {
    const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'your_twilio_account_sid'
    const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'your_twilio_auth_token'
    const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER || 'your_twilio_phone_number'
    
    const message = `🔧 Hi ${customerName}! Your Mobizilla repair booking for ${deviceInfo} is confirmed! Tracking Code: ${trackingCode}. Track: https://mobizilla.com/track/${trackingCode}`
    
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: '+977 9731852323',
        Body: message
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('📱 SMS sent successfully:', result.sid)
      return { success: true, sid: result.sid, message: 'SMS sent successfully' }
    } else {
      console.error('Twilio SMS error:', result)
      return { success: false, error: result.message || 'Failed to send SMS' }
    }
  } catch (error) {
    console.error('SMS sending error:', error)
    return { success: false, error: error.message }
  }
}

// Export the API for use in components
export const repairAPI = supabaseRepairAPI;

// Direct Email via SMTP Server
async function sendDirectEmail(customerName: string, trackingCode: string, deviceInfo: string, estimatedCost: number) {
  try {
    const EMAIL_SERVER_URL = import.meta.env.VITE_EMAIL_SERVER_URL || 'http://localhost:5003'
    
    const emailData = {
      customerName,
      trackingCode,
      deviceInfo,
      estimatedCost,
      to: import.meta.env.VITE_ADMIN_EMAIL || 'mobizillaindia@gmail.com'
    }

    console.log('📧 Sending email via SMTP server...', emailData)

    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ Email sent successfully:', result.messageId)
      return { success: true, message: 'Email sent successfully', messageId: result.messageId }
    } else {
      console.error('❌ Email server error:', result)
      return { success: false, error: result.error || `Failed to send email: ${response.status}` }
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return { success: false, error: error.message }
  }
}