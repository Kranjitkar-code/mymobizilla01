import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabaseRepairAPI as repairAPI } from '@/api/supabase-repair';
import { Helmet } from 'react-helmet-async';
import { Loader2, Search, Package, Wrench, CheckCircle, Clock } from 'lucide-react';

interface RepairStatus {
  public_code: string;
  status: string;
  device: string;
  created_at: string;
  estimated_completion?: string;
  updates: Array<{
    status: string;
    message: string;
    timestamp: string;
  }>;
}

function normalizeRepairData(data: any): RepairStatus {
  return {
    public_code: data.public_code || data.tracking_code || '',
    status: data.status || 'pending',
    device: data.device || `${data.brand || ''} ${data.model || ''}`.trim(),
    created_at: data.created_at || new Date().toISOString(),
    estimated_completion: data.estimated_completion || undefined,
    updates: Array.isArray(data.updates) ? data.updates : [],
  };
}

const statusIcons = {
  pending: <Package className="h-5 w-5" />,
  confirmed: <Clock className="h-5 w-5" />,
  in_progress: <Wrench className="h-5 w-5" />,
  completed: <CheckCircle className="h-5 w-5" />,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

export default function OrderTracking() {
  const { code } = useParams<{ code: string }>();
  const [trackingCode, setTrackingCode] = useState(code || '');
  const [repairStatus, setRepairStatus] = useState<RepairStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackRepair = async (searchCode?: string) => {
    const codeToSearch = searchCode || trackingCode;
    if (!codeToSearch) {
      setError('Please enter a tracking code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await repairAPI.trackRepair(codeToSearch);
      if (result.success && result.data) {
        setRepairStatus(normalizeRepairData(result.data));
      } else {
        setError('Repair order not found');
        setRepairStatus(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to track repair');
      setRepairStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      trackRepair(code);
    }
  }, [code]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Track Your Repair | Mobizilla</title>
        <meta name="description" content="Track your device repair status with Mobizilla. Get real-time updates on your repair progress." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Repair</h1>
          <p className="text-xl text-muted-foreground">
            Enter your tracking code to get real-time updates on your repair status
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Repair Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter your tracking code (e.g., AB12CD34)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={() => trackRepair()} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {loading ? 'Searching...' : 'Track'}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 mt-2 text-sm">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {repairStatus && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{repairStatus.public_code}</span>
                  <Badge className={`${statusColors[repairStatus.status as keyof typeof statusColors]} flex items-center gap-1`}>
                    {statusIcons[repairStatus.status as keyof typeof statusIcons]}
                    {repairStatus.status.charAt(0).toUpperCase() + repairStatus.status.slice(1).replace('_', ' ')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Device</p>
                    <p className="font-semibold">{repairStatus.device}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold">{formatDate(repairStatus.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Completion</p>
                    <p className="font-semibold">
                      {repairStatus.estimated_completion ? formatDate(repairStatus.estimated_completion) : 'To be confirmed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Repair Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairStatus.updates.map((update, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusColors[update.status as keyof typeof statusColors]}`}>
                        {statusIcons[update.status as keyof typeof statusIcons] || <Package className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{update.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(update.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Support</h4>
                    <p className="text-sm text-muted-foreground mb-1">Phone: +977-1-5354999</p>
                    <p className="text-sm text-muted-foreground mb-1">Email: support@mobizilla.com</p>
                    <p className="text-sm text-muted-foreground">Hours: Mon-Sat 9AM-7PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pickup & Delivery</h4>
                    <p className="text-sm text-muted-foreground mb-1">Free pickup and delivery within city limits</p>
                    <p className="text-sm text-muted-foreground mb-1">Same-day service available</p>
                    <p className="text-sm text-muted-foreground">All repairs backed by warranty</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Section */}
        {!repairStatus && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>How to Track Your Repair</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📱 SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    You received an SMS with your tracking code when you placed the order. 
                    Use that code to track your repair status.
                  </p>
                  <h4 className="font-semibold mb-3">📧 Email Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Check your email for the confirmation message with your tracking code 
                    and repair details.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🔍 Tracking Code Format</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your tracking code is 8 characters long and contains both letters and numbers.
                    Example: AB12CD34
                  </p>
                  <h4 className="font-semibold mb-3">❓ Lost Your Code?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team with your phone number or email address 
                    used during booking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


