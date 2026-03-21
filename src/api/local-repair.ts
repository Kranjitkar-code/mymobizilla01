// Local storage-based repair API (No Supabase required!)

import { BookingsService } from '@/services/bookingsService';

const REPAIRS_STORAGE_KEY = 'mobizilla_repairs';
const EMAIL_SERVER_URL = import.meta.env.VITE_EMAIL_SERVER_URL || 'http://localhost:5003';

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
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  tracking_code: string;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
}

// Helper functions for localStorage
function getAllRepairs(): RepairOrder[] {
  try {
    const data = localStorage.getItem(REPAIRS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading repairs from localStorage:', error);
    return [];
  }
}

function saveRepairs(repairs: RepairOrder[]): void {
  try {
    localStorage.setItem(REPAIRS_STORAGE_KEY, JSON.stringify(repairs));
  } catch (error) {
    console.error('Error saving repairs to localStorage:', error);
  }
}

function generateTrackingCode(): string {
  return `MB-${Date.now().toString().slice(-6)}`;
}

function calculateEstimatedCost(data: RepairFormData): number {
  // Base costs by category
  const baseCosts: Record<string, number> = {
    'smartphone': 1500,
    'laptop': 3000,
    'tablet': 2000,
    'desktop': 2500,
    'smartwatch': 1000,
    'console': 2000,
    'camera': 2500,
    'other': 1500
  };

  const baseCost = baseCosts[data.device_category?.toLowerCase()] || 1500;

  // Add variation based on issue type
  const issueMultipliers: Record<string, number> = {
    'screen': 1.2,
    'battery': 0.8,
    'water': 1.5,
    'software': 0.6,
    'charging': 0.7,
    'speaker': 0.9,
    'camera': 1.1,
    'button': 0.8,
    'motherboard': 2.0,
  };

  let multiplier = 1.0;
  const issue = data.issue?.toLowerCase() || '';

  for (const [key, value] of Object.entries(issueMultipliers)) {
    if (issue.includes(key)) {
      multiplier = value;
      break;
    }
  }

  return Math.round(baseCost * multiplier);
}

// Send email notification via email server
async function sendEmailNotification(data: RepairFormData, trackingCode: string, estimatedCost: number) {
  try {
    const deviceInfo = `${data.brand} ${data.model} (${data.device_category})`;

    console.log('📧 Sending email notification...');

    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: data.customer_name,
        trackingCode,
        deviceInfo,
        estimatedCost,
        to: data.customer_email || 'mobizillaindia@gmail.com',
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        description: data.description,
        issue: data.issue
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } else {
      console.error('❌ Email server error:', result);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
}

export const localRepairAPI = {
  // Create a new repair booking
  async createBooking(data: RepairFormData): Promise<{
    success: boolean;
    tracking_code?: string;
    error?: string;
    order?: RepairOrder;
    email_status?: any;
  }> {
    try {
      console.log('📝 Creating local repair booking...');

      // Generate tracking code
      const tracking_code = generateTrackingCode();

      // Calculate estimated cost
      const estimated_cost = calculateEstimatedCost(data);

      // Create repair order
      const newOrder: RepairOrder = {
        id: `repair_${Date.now()}`,
        ...data,
        tracking_code,
        estimated_cost,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to localStorage
      const repairs = getAllRepairs();
      repairs.unshift(newOrder); // Add to beginning
      saveRepairs(repairs);

      console.log('✅ Repair booking saved locally:', tracking_code);

      // Sync to Firebase for real-time tracking
      try {
        await BookingsService.syncBooking(newOrder);
        console.log('✅ Booking synced to Firebase for real-time tracking');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase sync failed, but booking saved locally:', firebaseError);
      }

      // Send email notification
      const emailResult = await sendEmailNotification(data, tracking_code, estimated_cost);

      if (emailResult.success) {
        console.log('✅ Email notification sent successfully');
      } else {
        console.log('⚠️ Email notification failed, but booking saved:', emailResult.error);
      }

      return {
        success: true,
        tracking_code,
        order: newOrder,
        email_status: emailResult
      };
    } catch (error: any) {
      console.error('❌ Error creating booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Get repair by tracking code
  async getByTrackingCode(trackingCode: string): Promise<RepairOrder | null> {
    try {
      const repairs = getAllRepairs();
      return repairs.find(r => r.tracking_code === trackingCode) || null;
    } catch (error) {
      console.error('Error getting repair:', error);
      return null;
    }
  },

  // Get all repairs
  async getAll(): Promise<RepairOrder[]> {
    try {
      return getAllRepairs();
    } catch (error) {
      console.error('Error getting all repairs:', error);
      return [];
    }
  },

  // Update repair status
  async updateStatus(trackingCode: string, status: RepairOrder['status'], note?: string): Promise<boolean> {
    try {
      const repairs = getAllRepairs();
      const index = repairs.findIndex(r => r.tracking_code === trackingCode);

      if (index === -1) {
        return false;
      }

      repairs[index].status = status;
      repairs[index].updated_at = new Date().toISOString();

      saveRepairs(repairs);
      console.log('✅ Repair status updated:', trackingCode, status);

      return true;
    } catch (error) {
      console.error('Error updating repair status:', error);
      return false;
    }
  },

  // Delete repair
  async delete(trackingCode: string): Promise<boolean> {
    try {
      const repairs = getAllRepairs();
      const filtered = repairs.filter(r => r.tracking_code !== trackingCode);

      if (filtered.length === repairs.length) {
        return false; // Not found
      }

      saveRepairs(filtered);
      console.log('✅ Repair deleted:', trackingCode);

      return true;
    } catch (error) {
      console.error('Error deleting repair:', error);
      return false;
    }
  },

  // Get statistics
  async getStats() {
    try {
      const repairs = getAllRepairs();

      return {
        total: repairs.length,
        pending: repairs.filter(r => r.status === 'pending').length,
        in_progress: repairs.filter(r => r.status === 'in_progress').length,
        completed: repairs.filter(r => r.status === 'completed').length,
        cancelled: repairs.filter(r => r.status === 'cancelled').length,
        total_revenue: repairs
          .filter(r => r.status === 'completed')
          .reduce((sum, r) => sum + r.estimated_cost, 0),
        recent: repairs.slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        total_revenue: 0,
        recent: []
      };
    }
  },

  // Export all data (for backup)
  exportData(): string {
    const repairs = getAllRepairs();
    return JSON.stringify(repairs, null, 2);
  },

  // Import data (for restore)
  importData(jsonData: string): boolean {
    try {
      const repairs = JSON.parse(jsonData);
      saveRepairs(repairs);
      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
  // Track repair by public code — returns data shaped for OrderTracking page
  async trackRepair(code: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const order = await this.getByTrackingCode(code);
      if (!order) {
        return { success: false, error: 'Repair order not found' };
      }

      const statusTimeline: Array<{ status: string; message: string; timestamp: string }> = [
        { status: 'pending', message: 'Order received', timestamp: order.created_at },
      ];
      if (order.status === 'in_progress' || order.status === 'completed') {
        statusTimeline.push({ status: 'in_progress', message: 'Repair in progress', timestamp: order.updated_at });
      }
      if (order.status === 'completed') {
        statusTimeline.push({ status: 'completed', message: 'Repair completed', timestamp: order.updated_at });
      }

      const estimatedCompletion = new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

      return {
        success: true,
        data: {
          public_code: order.tracking_code,
          status: order.status,
          device: `${order.brand} ${order.model}`,
          created_at: order.created_at,
          estimated_completion: estimatedCompletion,
          updates: statusTimeline,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Dummy testNotifications for UI compatibility
  async testNotifications() {
    return { success: true, results: { sms_sent: true, email_sent: true } };
  }
};

// Export as default and named export for compatibility
export default localRepairAPI;
