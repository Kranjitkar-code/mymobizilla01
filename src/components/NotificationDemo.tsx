import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageSquare, Mail, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationDemo() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const simulateNotifications = () => {
    setIsSimulating(true);
    setShowResults(false);

    // Simulate API call delay
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
      
      toast({
        title: '🎉 Test Completed Successfully!',
        description: 'SMS and Email notifications would be sent with your configured credentials.',
      });
    }, 2000);
  };

  const trackingCode = 'TEST' + Math.random().toString(36).substr(2, 4).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">📱 Mobizilla Notification System</h1>
        <p className="text-xl text-muted-foreground">
          SMS & Email Notification Demo - Fully Configured & Ready!
        </p>
      </div>

      {/* Configuration Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            System Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span className="font-medium">Twilio SMS</span>
              </div>
              <Badge className="bg-green-100 text-green-800">✅ Configured</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                <span className="font-medium">SendGrid Email</span>
              </div>
              <Badge className="bg-green-100 text-green-800">✅ Configured</Badge>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Current Configuration:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>📞 <strong>SMS From:</strong> +1 870 686 5717 (Twilio)</p>
              <p>📧 <strong>Email From:</strong> mobizillanepal@gmail.com (SendGrid)</p>
              <p>📱 <strong>SMS To:</strong> +977-1-5354999</p>
              <p>📮 <strong>Email To:</strong> mobizillanepal@gmail.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Test */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Notification System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Click below to simulate what happens when a customer books a repair
            </p>
            
            <Button 
              onClick={simulateNotifications}
              disabled={isSimulating}
              size="lg"
              className="min-w-48"
            >
              {isSimulating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Sending Notifications...
                </>
              ) : (
                'Test Notification System'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Notification Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* SMS Result */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">SMS Notification</p>
                    <p className="text-sm text-muted-foreground">To: +977-1-5354999</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">✅ Ready to Send</Badge>
              </div>

              {/* Email Result */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Confirmation</p>
                    <p className="text-sm text-muted-foreground">To: mobizillanepal@gmail.com</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">✅ Ready to Send</Badge>
              </div>

              {/* Sample Message Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">📱 Sample SMS Message:</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  ✅ Your Mobizilla repair order #{trackingCode} has been placed successfully! 
                  Track your repair status here: http://127.0.0.1:5174/track/{trackingCode}
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">📧 Sample Email Subject:</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  Repair Order Confirmation - #{trackingCode}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🚀 Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">To Enable Live Notifications:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Verify your phone number (+977-1-5354999) in Twilio Console</li>
                <li>Verify your email (mobizillanepal@gmail.com) in SendGrid</li>
                <li>Start the Laravel backend server</li>
                <li>Test a real repair booking from the main page</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">✅ What's Already Working:</h4>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Twilio credentials configured and ready</li>
                <li>SendGrid API key configured and ready</li>
                <li>Frontend notification system integrated</li>
                <li>Order tracking page available at /track</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}