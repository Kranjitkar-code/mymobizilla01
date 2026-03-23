import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import RepairBuybackForm, { type BookingSuccessData } from '@/components/forms/RepairBuybackForm';
import BookingSuccess from '@/components/booking/BookingSuccess';

export default function Repair() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingSuccessData | null>(null);
  const formAnchorRef = useRef<HTMLDivElement | null>(null);
  
  const selectedDevice = location.state?.selectedDevice;

  const handleBack = () => navigate('/');
  
  const handleDeviceFormSuccess = (data?: BookingSuccessData) => {
    setShowDeviceForm(false);
    if (data) {
      setBookingResult(data);
    }
  };
  
  const handleDeviceFormCancel = () => {
    setShowDeviceForm(false);
    navigate('/');
  };

  useEffect(() => {
    if (showDeviceForm) {
      setTimeout(() => {
        if (formAnchorRef.current) {
          formAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [showDeviceForm]);

  useEffect(() => {
    if (selectedDevice) {
      setShowDeviceForm(true);
    }
  }, [selectedDevice]);

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Helmet><title>Booking Confirmed | Mobizilla</title></Helmet>
        <BookingSuccess
          bookingRef={bookingResult.bookingRef}
          brand={bookingResult.brand}
          model={bookingResult.model}
          serviceType="repair"
          issues={bookingResult.issues}
        />
      </div>
    );
  }

  if (showDeviceForm) {
    return (
      <div ref={formAnchorRef} className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-8 md:py-12 lg:py-20">
        <Helmet>
          <title>Device Repair Request | Mobizilla</title>
          <meta name="description" content="Submit your device repair request with our easy multi-step form. Expert repairs for phones, tablets, and laptops." />
        </Helmet>

        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <RepairBuybackForm 
              selectedDevice={selectedDevice}
              serviceType="repair"
              onSuccess={handleDeviceFormSuccess}
              onCancel={handleDeviceFormCancel}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-8 md:py-12 lg:py-20">
      <Helmet>
        <title>Mobile Phone Repair Service Nepal — Mobizilla</title>
        <meta name="description" content="Professional mobile phone repair in Kathmandu. All brands: iPhone, Samsung, OnePlus, Xiaomi. Cracked screen, battery, water damage, camera repair." />
        <link rel="canonical" href="https://mymobizilla.com/repair" />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-6 -ml-2 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>

          <div className="text-center mb-8 sm:mb-12 px-2 sm:px-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Professional Device Repair
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Expert repair services for all your devices with quick turnaround and quality guarantee
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-1">Expert Technicians</h3>
              <p className="text-sm text-gray-600">Certified specialists</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-1">Quick Turnaround</h3>
              <p className="text-sm text-gray-600">24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-2xl">🛡</span>
              </div>
              <h3 className="font-semibold mb-1">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">90-day warranty</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Fix Your Device?</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We repair all major brands including Apple, Samsung, Google, OnePlus, Xiaomi and more. Our expert technicians use genuine parts and provide warranty on all repairs.
              </p>
              
              <Button 
                onClick={() => navigate('/?scrollTo=browse-by-brand')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
              >
                Select Your Device to Get Started
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Free diagnostic • Transparent pricing • Same-day service available
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
