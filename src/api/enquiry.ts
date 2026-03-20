// API service for enquiry submissions

interface EnquirySubmission {
  serviceType: 'repair' | 'buyback';
  deviceType: 'phone' | 'tablet' | 'laptop';
  brand: string;
  model: string;
  problem: string;
  problemOther?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  age?: 'less-than-1' | '1-2-years' | '2-4-years' | '4-plus-years';
  askingPrice?: string;
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  userAgent: string;
  submissionId: string;
}

interface SubmissionResponse {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
}

export async function submitEnquiry(data: EnquirySubmission): Promise<SubmissionResponse> {
  try {
    const response = await fetch('/api/enquiry/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
}
