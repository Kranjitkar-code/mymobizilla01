import axios from 'axios';

// Create axios instance for Google Forms backend
const googleFormsClient = axios.create({
  baseURL: import.meta.env.VITE_GOOGLE_FORMS_API_URL || 'http://localhost:5002',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Form submission data interface
export interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  serviceType: 'Repair' | 'Buyback' | string;
  details: string;
  deviceCategory?: string;
  brand?: string;
  model?: string;
  issue?: string;
  condition?: string;
  quoteValue?: string;
  [key: string]: any; // Allow additional dynamic fields
}

// Response interface
export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  data?: FormSubmissionData;
  error?: string;
}

export const googleFormsAPI = {
  /**
   * Submit form data to Google Sheets
   * @param data Form data to submit
   */
  async submitForm(data: FormSubmissionData): Promise<FormSubmissionResponse> {
    try {
      console.log('Submitting form data to Google Sheets:', data);
      const response = await googleFormsClient.post<FormSubmissionResponse>('/submit', data);
      console.log('Form submission response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error submitting form:', error);
      return {
        success: false,
        message: 'Failed to submit form data',
        error: error.response?.data?.error || error.message || 'Unknown error'
      };
    }
  },

  /**
   * Health check for the Google Forms backend
   */
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await googleFormsClient.get('/health');
      return response.data;
    } catch (error: any) {
      console.error('Health check failed:', error);
      return {
        success: false,
        message: 'Google Forms backend is not available'
      };
    }
  }
};