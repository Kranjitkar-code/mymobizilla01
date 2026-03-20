import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

// Form schema
const enquirySchema = z.object({
  serviceType: z.enum(['repair', 'buyback']),
  deviceType: z.enum(['phone', 'tablet', 'laptop']),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  problem: z.string().min(1, 'Problem is required'),
  problemOther: z.string().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  age: z.enum(['less-than-1', '1-2-years', '2-4-years', '4-plus-years']).optional(),
  askingPrice: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Please enter a valid Nepal mobile number (10 digits)'),
  // Honeypot field for spam protection
  website: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface McqEnquiryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const deviceBrands = {
  phone: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Google', 'Huawei', 'Other'],
  tablet: ['Apple', 'Samsung', 'Lenovo', 'Huawei', 'Microsoft', 'Amazon', 'Other'],
  laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Other']
};

const commonProblems = [
  'Screen cracked/damaged',
  'Battery not charging',
  'Water damage',
  'Speaker/microphone issues',
  'Software/OS issues',
  'Camera not working',
  'Charging port damaged',
  'Power button not working',
  'Overheating',
  'Other'
];

export default function McqEnquiryForm({ onSuccess, onCancel }: McqEnquiryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      website: '', // Honeypot field
    }
  });

  const watchedValues = watch();
  const totalSteps = watchedValues.serviceType === 'buyback' ? 6 : 5;

  const nextStep = async () => {
    let fieldsToValidate: (keyof EnquiryFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['serviceType'];
        break;
      case 2:
        fieldsToValidate = ['deviceType'];
        break;
      case 3:
        fieldsToValidate = ['brand', 'model'];
        break;
      case 4:
        fieldsToValidate = ['problem'];
        break;
      case 5:
        if (watchedValues.serviceType === 'buyback') {
          fieldsToValidate = ['condition', 'age'];
        } else {
          fieldsToValidate = ['name', 'email', 'phone'];
        }
        break;
      case 6:
        fieldsToValidate = ['name', 'email', 'phone'];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: EnquiryFormData) => {
    // Check honeypot field
    if (data.website) {
      toast({
        title: 'Submission failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add metadata
      const submissionData = {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        submissionId: `ENQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Prefer '/api/submit' (proxied to backend). Backend also accepts '/enquiry/submit'.
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      const result = await response.json();
      
      setIsSubmitted(true);
      toast({
        title: 'Enquiry submitted successfully!',
        description: 'Our team will contact you shortly.',
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast({
        title: 'Submission failed',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Your {watchedValues.serviceType} enquiry has been submitted successfully. 
            Our team will contact you shortly.
          </p>
          <Button onClick={onCancel} variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {watchedValues.serviceType === 'buyback' ? 'Device Buyback' : 'Device Repair'} Enquiry
        </CardTitle>
        <CardDescription>
          Step {currentStep} of {totalSteps}
        </CardDescription>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field */}
          <input
            type="text"
            {...register('website')}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Step 1: Service Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Choose Service Type</Label>
              <RadioGroup
                value={watchedValues.serviceType}
                onValueChange={(value) => setValue('serviceType', value as 'repair' | 'buyback')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="repair" id="repair" />
                  <Label htmlFor="repair">Repair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buyback" id="buyback" />
                  <Label htmlFor="buyback">Buyback</Label>
                </div>
              </RadioGroup>
              {errors.serviceType && (
                <p className="text-sm text-red-500">{errors.serviceType.message}</p>
              )}
            </div>
          )}

          {/* Step 2: Device Type */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Device Type</Label>
              <RadioGroup
                value={watchedValues.deviceType}
                onValueChange={(value) => setValue('deviceType', value as 'phone' | 'tablet' | 'laptop')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone">Phone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tablet" id="tablet" />
                  <Label htmlFor="tablet">Tablet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="laptop" id="laptop" />
                  <Label htmlFor="laptop">Laptop</Label>
                </div>
              </RadioGroup>
              {errors.deviceType && (
                <p className="text-sm text-red-500">{errors.deviceType.message}</p>
              )}
            </div>
          )}

          {/* Step 3: Brand & Model */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand" className="text-base font-medium">Brand</Label>
                <Select
                  value={watchedValues.brand}
                  onValueChange={(value) => setValue('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchedValues.deviceType && deviceBrands[watchedValues.deviceType]?.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand && (
                  <p className="text-sm text-red-500">{errors.brand.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="model" className="text-base font-medium">Model</Label>
                <Input
                  id="model"
                  {...register('model')}
                  placeholder="Enter device model"
                />
                {errors.model && (
                  <p className="text-sm text-red-500">{errors.model.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Problem */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Problem/Issue</Label>
              <RadioGroup
                value={watchedValues.problem}
                onValueChange={(value) => setValue('problem', value)}
              >
                {commonProblems.map((problem) => (
                  <div key={problem} className="flex items-center space-x-2">
                    <RadioGroupItem value={problem} id={problem} />
                    <Label htmlFor={problem}>{problem}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              {watchedValues.problem === 'Other' && (
                <div>
                  <Label htmlFor="problemOther">Please describe the issue</Label>
                  <Textarea
                    id="problemOther"
                    {...register('problemOther')}
                    placeholder="Describe the problem in detail..."
                    rows={3}
                  />
                </div>
              )}
              
              {errors.problem && (
                <p className="text-sm text-red-500">{errors.problem.message}</p>
              )}
            </div>
          )}

          {/* Step 5: Buyback Details (only for buyback) */}
          {currentStep === 5 && watchedValues.serviceType === 'buyback' && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Device Condition</Label>
                <RadioGroup
                  value={watchedValues.condition}
                  onValueChange={(value) => setValue('condition', value as 'excellent' | 'good' | 'fair' | 'poor')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent">Excellent (Like new, no wear)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">Good (Minor wear, fully functional)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair">Fair (Visible wear, works properly)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor">Poor (Heavy wear, some issues)</Label>
                  </div>
                </RadioGroup>
                {errors.condition && (
                  <p className="text-sm text-red-500">{errors.condition.message}</p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">Age of Device</Label>
                <RadioGroup
                  value={watchedValues.age}
                  onValueChange={(value) => setValue('age', value as 'less-than-1' | '1-2-years' | '2-4-years' | '4-plus-years')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less-than-1" id="less-than-1" />
                    <Label htmlFor="less-than-1">Less than 1 year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2-years" id="1-2-years" />
                    <Label htmlFor="1-2-years">1-2 years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-4-years" id="2-4-years" />
                    <Label htmlFor="2-4-years">2-4 years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4-plus-years" id="4-plus-years" />
                    <Label htmlFor="4-plus-years">4+ years</Label>
                  </div>
                </RadioGroup>
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="askingPrice" className="text-base font-medium">Asking Price (Optional)</Label>
                <Input
                  id="askingPrice"
                  {...register('askingPrice')}
                  placeholder="Enter your expected price"
                  type="number"
                />
              </div>
            </div>
          )}

          {/* Step 6/5: Contact Details */}
          {((currentStep === 5 && watchedValues.serviceType === 'repair') || 
            (currentStep === 6 && watchedValues.serviceType === 'buyback')) && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Contact Details</Label>
              
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your 10-digit Nepal mobile number
                </p>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <Button type="button" onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep === 1 && onCancel && (
              <Button type="button" onClick={onCancel} variant="outline">
                Cancel
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
