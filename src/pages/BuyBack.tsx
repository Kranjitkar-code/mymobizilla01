import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import RepairBuybackForm from '@/components/forms/RepairBuybackForm';

export default function BuyBack() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  const formAnchorRef = useRef<HTMLDivElement | null>(null);
  
  // Check if we have a selected device from the device browser
  const selectedDevice = location.state?.selectedDevice;

  const handleBack = () => navigate('/');
  
  const handleDeviceFormSuccess = () => {
    setShowDeviceForm(false);
    alert('Your buyback request has been submitted successfully! We will contact you soon.');
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

  // Auto-show device form if device is selected
  useEffect(() => {
    if (selectedDevice) {
      setShowDeviceForm(true);
    }
  }, [selectedDevice]);

  if (showDeviceForm) {
    return (
      <div ref={formAnchorRef} className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-8 md:py-12 lg:py-20">
        <Helmet>
          <title>Device Buyback Request | Mobizilla</title>
          <meta name="description" content="Submit your device buyback request with our easy multi-step form. Get the best price for your device." />
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
              serviceType="buyback"
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
        <title>Sell Your Device - Buyback | Mobizilla</title>
        <meta name="description" content="Sell your old device and get instant quotes at Mobizilla." />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Sell Your Device
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Get instant quotes and the best price for your device
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">💳</span>
              </div>
              <h3 className="font-semibold mb-1">Instant Payment</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600">🛡️</span>
              </div>
              <h3 className="font-semibold mb-1">Secure Data Wipe</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600">💰</span>
              </div>
              <h3 className="font-semibold mb-1">Transparent Valuation</h3>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600">✅</span>
              </div>
              <h3 className="font-semibold mb-1">1000+ Happy Sellers</h3>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-12">How Our Buy Back Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Tell Us About Your Device</h3>
                <p className="text-gray-600">Brand, model, and condition</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-600 text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Get Instant Quote</h3>
                <p className="text-gray-600">Transparent, market-based pricing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Free Pickup & Payment</h3>
                <p className="text-gray-600">We collect, verify, and pay instantly</p>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Sell Your Device?</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We buy a wide range of brands including Apple, Samsung, Google, OnePlus, Xiaomi and more. Pricing 
                depends on model, storage, condition, and market demand.
              </p>
              
              <Button 
                onClick={() => navigate('/?scrollTo=browse-by-brand')}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
              >
                Select Your Device to Get Started
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Bring original box/charger to improve valuation • Instant payment on verification
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
