import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Phone, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingSuccessProps {
  bookingRef: string;
  brand: string;
  model: string;
  serviceType: 'repair' | 'buyback';
  issues?: string;
}

export default function BookingSuccess({ bookingRef, brand, model, serviceType, issues }: BookingSuccessProps) {
  const navigate = useNavigate();
  const isRepair = serviceType === 'repair';
  const accentColor = isRepair ? 'blue' : 'green';

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <Card className="max-w-lg w-full shadow-lg border-0">
        <CardContent className="p-8 text-center space-y-6">
          <div className={`w-20 h-20 bg-${accentColor}-100 rounded-full flex items-center justify-center mx-auto`}>
            <CheckCircle className={`w-12 h-12 text-${accentColor}-600`} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your {isRepair ? 'repair' : 'buyback'} request has been submitted successfully.
            </p>
          </div>

          <div className={`bg-${accentColor}-50 rounded-xl p-5 border border-${accentColor}-100`}>
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <p className={`text-3xl font-bold text-${accentColor}-700 tracking-wider`}>{bookingRef}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Device</span>
              <span className="text-sm font-medium text-gray-900">{brand} {model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{serviceType}</span>
            </div>
            {issues && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500 mb-2">Issues</p>
                <div className="flex flex-wrap gap-1.5">
                  {issues.split(';').map((issue, i) => (
                    <span key={i} className="inline-block bg-white border rounded-full px-3 py-0.5 text-xs text-gray-700">
                      {issue.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium">
              We will contact you within 2 hours to confirm your appointment.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <a href="tel:+977-1-5354999" className="inline-flex items-center gap-1 hover:text-gray-700">
              <Phone className="w-3.5 h-3.5" /> +977-1-5354999
            </a>
            <span className="text-gray-300">|</span>
            <a href="tel:+977-9801018203" className="inline-flex items-center gap-1 hover:text-gray-700">
              <Phone className="w-3.5 h-3.5" /> +977-9801018203
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="flex-1"
            >
              Track Your {isRepair ? 'Repair' : 'Request'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate('/')}
              className={`flex-1 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white`}
            >
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
