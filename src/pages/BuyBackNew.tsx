import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Clock, ShieldCheck, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import McqEnquiryForm from '@/components/forms/McqEnquiryForm';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
    <div className="p-3 rounded-full bg-primary/10 mb-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default function BuyBackNew() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const formAnchorRef = useRef<HTMLDivElement | null>(null);

  const handleBack = () => navigate('/');
  const handleStartBuyback = () => setShowForm(true);
  const handleFormSuccess = () => {
    setShowForm(false);
  };
  const handleFormCancel = () => {
    setShowForm(false);
  };

  useEffect(() => {
    if (showForm) {
      // Smooth scroll the form into view after it renders
      setTimeout(() => {
        if (formAnchorRef.current) {
          formAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [showForm]);

  if (showForm) {
    return (
      <div ref={formAnchorRef} className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-8 md:py-12 lg:py-20">
        <Helmet>
          <title>Device Buyback Request | Mobizilla</title>
          <meta name="description" content="Submit your device buyback request with our easy multi-step form. Get the best value for your device." />
        </Helmet>

        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Button 
              variant="ghost" 
              onClick={handleFormCancel}
              className="mb-6 -ml-2 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>

            <McqEnquiryForm 
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-8 md:py-12 lg:py-20">
      <Helmet>
        <title>Smart BuyBack | Mobizilla</title>
        <meta name="description" content="Get an instant quote for your device with our smart buyback program. Quick, easy, and secure process." />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Smart Device BuyBack
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Get the best value for your used devices with our instant valuation system
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
            <FeatureCard 
              icon={DollarSign} 
              title="Best Prices" 
              description="Competitive rates for your used devices" 
            />
            <FeatureCard 
              icon={Clock} 
              title="Fast Process" 
              description="Get a quote in minutes, payment in days" 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Secure & Safe" 
              description="100% secure transactions and data protection" 
            />
          </div>

          <Card className="border-0 shadow-lg overflow-hidden mx-2 sm:mx-0">
            <div className="bg-gradient-to-r from-primary to-primary/90 text-white">
              <CardHeader className="px-4 sm:px-6 py-4">
                <CardTitle className="text-xl sm:text-2xl font-bold">Start Your BuyBack Request</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                  Complete our simple form to get an instant quote
                </CardDescription>
              </CardHeader>
            </div>
            <Separator />
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-center space-y-8">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Smartphone className="h-10 w-10 text-primary" />
                </div>
                
                <div className="text-center space-y-4 sm:space-y-6 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-semibold">Quick & Easy Valuation</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Our on-site multi-step form will guide you through a simple process to evaluate your device's condition and provide you with an instant quote.
                  </p>
                  
                  <div className="text-left bg-muted/20 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                    <h4 className="font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">You'll need to provide:</h4>
                    <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc pl-4 sm:pl-5">
                      <li>Your contact information (Name, Email, Phone, Address)</li>
                      <li>Device category (Smartphone, Laptop, or Tablet)</li>
                      <li>Device brand and model</li>
                      <li>Device condition assessment</li>
                      <li>Preferred delivery option</li>
                    </ul>
                    <p className="text-[10px] xs:text-xs text-muted-foreground mt-2 sm:mt-3">
                      * All fields are required for an accurate quote
                    </p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  onClick={handleStartBuyback}
                  className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-medium group"
                >
                  Start Your BuyBack Request
                  <ArrowLeft className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="text-xs sm:text-sm text-muted-foreground text-center max-w-md px-2">
                  <p>By proceeding, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-2">
            <p>Questions? Contact our support team at <a href="mailto:support@mobizilla.com" className="text-primary hover:underline">support@mobizilla.com</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}