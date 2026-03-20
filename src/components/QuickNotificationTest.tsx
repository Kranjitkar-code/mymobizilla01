import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { repairAPI } from '@/api/repair';
import { useState } from 'react';

export default function QuickNotificationTest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const testRealNotifications = async () => {
    setLoading(true);
    try {
      const result = await repairAPI.testNotifications();
      
      if (result.success) {
        toast({
          title: 'Real Notifications Sent! 🎉',
          description: 'Check +977-1-5354999 for SMS and mobizillanepal@gmail.com for email!',
        });
      } else {
        throw new Error(result.error || 'Test failed');
      }
    } catch (error: any) {
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"p-4 border rounded-lg bg-blue-50\">
      <h3 className=\"font-semibold mb-2\">🚀 Quick Notification Test</h3>
      <p className=\"text-sm text-gray-600 mb-3\">
        Test real SMS & Email notifications powered by Twilio & SendGrid
      </p>
      <Button 
        onClick={testRealNotifications} 
        disabled={loading}
        className=\"w-full\"
      >
        {loading ? 'Sending...' : '📱 Send Real Test Notifications'}
      </Button>
    </div>
  );
}"