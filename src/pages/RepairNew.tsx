import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Shield, Clock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
    <div className="p-3 rounded-full bg-primary/10 mb-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default function RepairNew() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/');
  const handleGoogleFormsRedirect = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdH99rXhXqpxtzTmCgzMaFXwWUYOj6gqVoaebgBgY6T-E1R4g/viewform', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-8 md:py-12 lg:py-20">
      <Helmet>
        <title>Repair Services | Mobizilla</title>
        <meta name="description" content="Professional device repair services with genuine parts and warranty. Fast, reliable, and affordable repairs for all your devices." />
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
              Professional Device Repairs
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Expert repairs with genuine parts and warranty for all your devices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
            <FeatureCard 
              icon={Wrench} 
              title="Expert Technicians" 
              description="Certified professionals with years of experience" 
            />
            <FeatureCard 
              icon={Shield} 
              title="Warranty" 
              description="90-day warranty on all repairs" 
            />
            <FeatureCard 
              icon={Clock} 
              title="Fast Turnaround" 
              description="Most repairs completed within 24-48 hours" 
            />
          </div>

          <Card className="border-0 shadow-lg overflow-hidden mx-2 sm:mx-0">
            <div className="bg-gradient-to-r from-primary to-primary/90 text-white">
              <CardHeader className="px-4 sm:px-6 py-4">
                <CardTitle className="text-xl sm:text-2xl font-bold">Start Your Repair Request</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                  Complete our simple form to get your repair started
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
                  <h3 className="text-xl sm:text-2xl font-semibold">Fast & Easy Process</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Our Google Form will guide you through a simple process to describe your device's issue and schedule a repair. The form will open in a new tab.
                  </p>
                  
                  <div className="text-left bg-muted/20 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                    <h4 className="font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">You'll need to provide:</h4>
                    <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-muted-foreground list-disc pl-4 sm:pl-5">
                      <li>Your contact information (Name, Email, Phone, Address)</li>
                      <li>Service type (Repair or Others)</li>
                      <li>Device category (Smartphone, Laptop, or Tablet)</li>
                      <li>Device brand and model</li>
                      <li>Detailed description of the issue</li>
                      <li>Device condition assessment</li>
                      <li>Photos of the device (up to 5, max 100MB each)</li>
                    </ul>
                    <p className="text-[10px] xs:text-xs text-muted-foreground mt-2 sm:mt-3">
                      * All fields are required for accurate service assessment
                    </p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  onClick={handleGoogleFormsRedirect}
                  className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-medium group"
                >
                  Start Your Repair Request
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
