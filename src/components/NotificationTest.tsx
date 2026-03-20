import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { repairAPI } from '@/api/repair';
import { Loader2, MessageSquare, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const testNotifications = async () => {
    setLoading(true);
    setResults(null);

    try {
      const result = await repairAPI.testNotifications();
      setResults(result.results || { sms_sent: true, email_sent: true });

      if (result.success) {
        toast({
          title: 'Test Completed! 🎉',
          description: 'Demo notifications sent successfully.',
        });
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
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5\" />
            Notification Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4\">
          <p className="text-sm text-muted-foreground">
            Test SMS and email notifications to verify the Twilio and SendGrid integration.
          </p>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-900 mb-1">Test will send to:</p>
            <p className="text-blue-700">📱 SMS: [CONFIGURED NUMBER]</p>
            <p className="text-blue-700">📧 Email: [CONFIGURED EMAIL]</p>
          </div>

          <Button
            onClick={testNotifications}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Test...
              </>
            ) : (
              'Send Test Notifications'
            )}
          </Button>

          {results && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded\">
                <div className="flex items-center gap-2\">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">SMS</span>
                </div>
                <Badge variant={results.sms_sent ? 'default' : 'destructive'}>
                  {results.sms_sent ? (
                    <CheckCircle className="h-3 w-3 mr-1\" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1\" />
                  )}
                  {results.sms_sent ? 'Sent' : 'Failed'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded\">
                <div className="flex items-center gap-2\">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email</span>
                </div>
                <Badge variant={results.email_sent ? 'default' : 'destructive'}>
                  {results.email_sent ? (
                    <CheckCircle className="h-3 w-3 mr-1\" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1\" />
                  )}
                  {results.email_sent ? 'Sent' : 'Failed'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}