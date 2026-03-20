import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Smartphone, DollarSign, Wrench } from 'lucide-react';
import { repairAPI, type RepairFormData } from '@/api/repair';

interface SelectedDevice {
  brand: string;
  model: string;
  category?: string;
}

interface RepairBuybackFormProps {
  selectedDevice?: SelectedDevice;
  serviceType?: 'repair' | 'buyback';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RepairBuybackForm({ selectedDevice, serviceType: initialServiceType, onSuccess, onCancel }: RepairBuybackFormProps) {
  const [currentStep, setCurrentStep] = useState(initialServiceType ? 2 : 1);
  const [serviceType, setServiceType] = useState<'repair' | 'buyback' | ''>(initialServiceType || '');
  const [problem, setProblem] = useState('');
  const [deviceCondition, setDeviceCondition] = useState('');
  const [showOtherProblem, setShowOtherProblem] = useState(false);
  const [otherProblemText, setOtherProblemText] = useState('');
  const [showOtherCondition, setShowOtherCondition] = useState(false);
  const [otherConditionText, setOtherConditionText] = useState('');
  
  // Buyback MCQ states
  const [physicalCondition, setPhysicalCondition] = useState('');
  const [screenCondition, setScreenCondition] = useState('');
  const [functionalStatus, setFunctionalStatus] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [accessories, setAccessories] = useState('');
  const [otherAccessories, setOtherAccessories] = useState('');
  const [deviceAge, setDeviceAge] = useState('');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load device info from session storage if not passed as prop
  const [deviceInfo, setDeviceInfo] = useState<SelectedDevice | undefined>(selectedDevice);
  
  // Common repair issues
  const repairIssues = [
    'Screen Cracked/Broken',
    'Battery Draining Fast',
    'Not Charging',
    'Water Damage',
    'Camera Not Working',
    'Speaker/Audio Issues',
    'Microphone Not Working',
    'WiFi/Bluetooth Issues',
    'Overheating',
    'Software/Performance Issues',
    'Button Not Working',
    'Touchscreen Not Responding',
    'Back Glass Broken',
    'Port/Charging Jack Issues',
    'Face ID/Fingerprint Sensor Issues',
    'Other'
  ];

  // Device condition options for buyback - MCQ step 1
  const physicalConditionOptions = [
    'Excellent - Like New, No Scratches',
    'Very Good - Minor Scratches Only',
    'Good - Normal Wear & Tear',
    'Fair - Visible Scratches/Dents',
    'Poor - Heavy Damage/Cracks'
  ];

  // Screen condition options - MCQ step 2
  const screenConditionOptions = [
    'Perfect - No Scratches or Cracks',
    'Minor Scratches - Barely Visible',
    'Visible Scratches - But Working Fine',
    'Cracked - Still Functioning',
    'Broken/Not Working'
  ];

  // Functional status options - MCQ step 3
  const functionalStatusOptions = [
    'Fully Functional - Everything Works',
    'Mostly Working - Minor Issues',
    'Partially Working - Some Features Broken',
    'Powers On - Major Issues',
    'Not Turning On/Dead'
  ];

  // Battery health options - MCQ step 4
  const batteryHealthOptions = [
    'Excellent - Lasts Full Day',
    'Good - Needs Charging Once Daily',
    'Fair - Needs Multiple Charges',
    'Poor - Drains Very Fast',
    'Battery Needs Replacement'
  ];

  // Accessories options - MCQ step 5
  const accessoriesOptions = [
    'Original Box + All Accessories',
    'Box + Charger Only',
    'Charger Only',
    'No Accessories',
    'Other'
  ];
  
  // Auto-save form data to localStorage
  const FORM_STORAGE_KEY = 'mobizilla_form_draft';
  
  // Load saved form data on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setServiceType(parsed.serviceType || '');
        setProblem(parsed.problem || '');
        setDeviceCondition(parsed.deviceCondition || '');
        setShowOtherProblem(parsed.showOtherProblem || false);
        setOtherProblemText(parsed.otherProblemText || '');
        setShowOtherCondition(parsed.showOtherCondition || false);
        setOtherConditionText(parsed.otherConditionText || '');
        // Buyback MCQ fields
        setPhysicalCondition(parsed.physicalCondition || '');
        setScreenCondition(parsed.screenCondition || '');
        setFunctionalStatus(parsed.functionalStatus || '');
        setBatteryHealth(parsed.batteryHealth || '');
        setAccessories(parsed.accessories || '');
        setOtherAccessories(parsed.otherAccessories || '');
        setDeviceAge(parsed.deviceAge || '');
        setCustomerInfo(parsed.customerInfo || { name: '', email: '', phone: '', address: '' });
        setAdditionalDetails(parsed.additionalDetails || '');
        console.log('📝 Loaded saved form data from localStorage');
      } catch (error) {
        console.error('Error loading saved form:', error);
      }
    }
  }, []);
  
  // Save form data whenever it changes
  useEffect(() => {
    const formData = {
      serviceType,
      problem,
      deviceCondition,
      showOtherProblem,
      otherProblemText,
      showOtherCondition,
      otherConditionText,
      // Buyback MCQ fields
      physicalCondition,
      screenCondition,
      functionalStatus,
      batteryHealth,
      accessories,
      otherAccessories,
      deviceAge,
      customerInfo,
      additionalDetails,
      deviceInfo,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    console.log('💾 Auto-saved form data to localStorage');
  }, [serviceType, problem, deviceCondition, showOtherProblem, otherProblemText, showOtherCondition, otherConditionText, 
      physicalCondition, screenCondition, functionalStatus, batteryHealth, accessories, otherAccessories, deviceAge,
      customerInfo, additionalDetails, deviceInfo]);
  
  useEffect(() => {
    if (!deviceInfo) {
      const storedDevice = sessionStorage.getItem('selectedDevice');
      if (storedDevice) {
        try {
          const device = JSON.parse(storedDevice);
          setDeviceInfo(device);
        } catch (error) {
          console.error('Error parsing stored device:', error);
        }
      }
    }
  }, [deviceInfo]);

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value as 'repair' | 'buyback');
    setCurrentStep(2);
  };

  const getTotalSteps = () => {
    // Repair: 1=device, 2=problem, 3=additional, 4=contact = 4 steps
    // Buyback: 1=device, 2=physical, 3=screen, 4=functional, 5=battery, 6=accessories, 7=additional, 8=contact = 8 steps
    return serviceType === 'buyback' ? 8 : 4;
  };

  const handleNext = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!deviceInfo) return;

    setIsSubmitting(true);
    
    try {
      // Get the actual problem/condition text
      const actualProblem = problem === 'Other' ? otherProblemText : problem;
      
      // Compile buyback condition report
      let buybackConditionReport = '';
      if (serviceType === 'buyback') {
        buybackConditionReport = `
BUYBACK DEVICE ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━
Physical Condition: ${physicalCondition}
Screen Condition: ${screenCondition}
Functional Status: ${functionalStatus}
Battery Health: ${batteryHealth}
Accessories: ${accessories === 'Other' ? otherAccessories : accessories}
Device Age: ${deviceAge || 'Not specified'}
━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
      }
      
      const formData: RepairFormData = {
        device_category: deviceInfo.category || 'Smartphone',
        brand: deviceInfo.brand,
        model: deviceInfo.model,
        issue: serviceType === 'repair' ? actualProblem : 'DEVICE BUYBACK REQUEST',
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        description: `
SERVICE TYPE: ${serviceType.toUpperCase()}
${serviceType === 'repair' ? `
PROBLEM: ${actualProblem}
` : buybackConditionReport}
ADDITIONAL DETAILS: ${additionalDetails || 'None'}
ADDRESS: ${customerInfo.address}
DEVICE SERIES: ${deviceInfo.category || 'N/A'}
        `.trim()
      };

      console.log('📤 Submitting booking with full details:', formData);
      
      const result = await repairAPI.createBooking(formData);
      
      console.log('✅ Booking result:', result);
      
      // Clear form draft from localStorage after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      console.log('🗑️ Cleared form draft from localStorage');
      
      // Clear session storage
      sessionStorage.removeItem('selectedDevice');
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Selected Device</h3>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Brand</p>
                <p className="font-medium">{deviceInfo?.brand}</p>
                <p className="text-sm text-muted-foreground mb-1 mt-2">Model</p>
                <p className="font-medium">{deviceInfo?.model}</p>
                {deviceInfo?.category && (
                  <>
                    <p className="text-sm text-muted-foreground mb-1 mt-2">Series</p>
                    <p className="font-medium">{deviceInfo.category}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">What would you like to do?</h3>
              <RadioGroup value={serviceType} onValueChange={handleServiceTypeChange}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/20 cursor-pointer">
                  <RadioGroupItem value="repair" id="repair" />
                  <Label htmlFor="repair" className="flex items-center space-x-2 cursor-pointer flex-1">
                    <Wrench className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Repair Service</p>
                      <p className="text-sm text-muted-foreground">Fix issues with your device</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/20 cursor-pointer">
                  <RadioGroupItem value="buyback" id="buyback" />
                  <Label htmlFor="buyback" className="flex items-center space-x-2 cursor-pointer flex-1">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Sell Your Device</p>
                      <p className="text-sm text-muted-foreground">Get cash for your old device</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      // REPAIR FLOW - Step 2: Problem Selection
      case 2:
        if (serviceType === 'repair') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full mb-3 bg-blue-100">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">What's the Problem?</h3>
                <p className="text-sm text-muted-foreground">Select the issue with your device</p>
              </div>
              
              <div className="space-y-4">
                <Label className="text-blue-900">Select Problem</Label>
                <RadioGroup 
                  value={problem}
                  onValueChange={(value) => {
                    setProblem(value);
                    setShowOtherProblem(value === 'Other');
                    if (value !== 'Other') setOtherProblemText('');
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {repairIssues.map((option) => (
                    <div 
                      key={option}
                      className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-300"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer flex-1 font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {showOtherProblem && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="otherText">Please specify the problem</Label>
                    <Textarea
                      id="otherText"
                      placeholder="Describe the problem in detail..."
                      value={otherProblemText}
                      onChange={(e) => setOtherProblemText(e.target.value)}
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }
        // BUYBACK FLOW - Step 2: Physical Condition
        else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full mb-3 bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">Physical Condition</h3>
                <p className="text-sm text-muted-foreground">How does your device look overall?</p>
              </div>
              
              <div className="space-y-4">
                <Label className="text-green-900">Select Overall Physical Condition</Label>
                <RadioGroup 
                  value={physicalCondition}
                  onValueChange={setPhysicalCondition}
                  className="space-y-3"
                >
                  {physicalConditionOptions.map((option) => (
                    <div 
                      key={option}
                      className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all hover:bg-green-50 hover:border-green-300"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer flex-1 font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        }

      // REPAIR FLOW - Step 3: Additional Details
      // BUYBACK FLOW - Step 3: Screen Condition
      case 3:
        if (serviceType === 'repair') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
                <p className="text-sm text-muted-foreground">
                  Any other information that might help us?
                </p>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="additional">Additional Information (Optional)</Label>
                <Textarea
                  id="additional"
                  placeholder="Any other details, special requirements, or questions you have..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full mb-3 bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">Screen Condition</h3>
                <p className="text-sm text-muted-foreground">What's the condition of the screen?</p>
              </div>
              
              <div className="space-y-4">
                <Label className="text-green-900">Select Screen Condition</Label>
                <RadioGroup 
                  value={screenCondition}
                  onValueChange={setScreenCondition}
                  className="space-y-3"
                >
                  {screenConditionOptions.map((option) => (
                    <div 
                      key={option}
                      className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all hover:bg-green-50 hover:border-green-300"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer flex-1 font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        }

      // REPAIR FLOW - Step 4: Contact Info
      // BUYBACK FLOW - Step 4: Functional Status
      case 4:
        if (serviceType === 'repair') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  We'll use this to get back to you about your {serviceType}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter your full address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full mb-3 bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">Functional Status</h3>
                <p className="text-sm text-muted-foreground">How well does your device work?</p>
              </div>
              
              <div className="space-y-4">
                <Label className="text-green-900">Select Functional Status</Label>
                <RadioGroup 
                  value={functionalStatus}
                  onValueChange={setFunctionalStatus}
                  className="space-y-3"
                >
                  {functionalStatusOptions.map((option) => (
                    <div 
                      key={option}
                      className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all hover:bg-green-50 hover:border-green-300"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer flex-1 font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        }

      // BUYBACK ONLY - Step 5: Battery Health
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full mb-3 bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">Battery Health</h3>
              <p className="text-sm text-muted-foreground">How is the battery performance?</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-green-900">Select Battery Health</Label>
              <RadioGroup 
                value={batteryHealth}
                onValueChange={setBatteryHealth}
                className="space-y-3"
              >
                {batteryHealthOptions.map((option) => (
                  <div 
                    key={option}
                    className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all hover:bg-green-50 hover:border-green-300"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer flex-1 font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      // BUYBACK ONLY - Step 6: Accessories & Age
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full mb-3 bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">Accessories & Age</h3>
              <p className="text-sm text-muted-foreground">What comes with the device?</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-green-900">Included Accessories</Label>
                <RadioGroup 
                  value={accessories}
                  onValueChange={(value) => {
                    setAccessories(value);
                    if (value !== 'Other') setOtherAccessories('');
                  }}
                  className="space-y-3"
                >
                  {accessoriesOptions.map((option) => (
                    <div 
                      key={option}
                      className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer transition-all hover:bg-green-50 hover:border-green-300"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer flex-1 font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {accessories === 'Other' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="otherAccessories">Please specify accessories</Label>
                    <Input
                      id="otherAccessories"
                      placeholder="E.g., Case, screen protector..."
                      value={otherAccessories}
                      onChange={(e) => setOtherAccessories(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceAge">Device Age (Optional)</Label>
                <Input
                  id="deviceAge"
                  placeholder="E.g., 1 year, 2 years 3 months..."
                  value={deviceAge}
                  onChange={(e) => setDeviceAge(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      // BUYBACK ONLY - Step 7: Additional Details
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
              <p className="text-sm text-muted-foreground">
                Any other information about your device?
              </p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="additional">Additional Information (Optional)</Label>
              <Textarea
                id="additional"
                placeholder="Any other details, special requirements, or questions you have..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      // BUYBACK ONLY - Step 8: Contact Info
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                We'll use this to get back to you with a quote
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your full address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return serviceType !== '';
      
      case 2:
        if (serviceType === 'repair') {
          if (problem === 'Other') {
            return otherProblemText.trim() !== '';
          }
          return problem.trim() !== '';
        } else {
          // Buyback step 2: Physical condition
          return physicalCondition.trim() !== '';
        }
      
      case 3:
        if (serviceType === 'repair') {
          // Repair step 3: Additional details (optional)
          return true;
        } else {
          // Buyback step 3: Screen condition
          return screenCondition.trim() !== '';
        }
      
      case 4:
        if (serviceType === 'repair') {
          // Repair step 4: Contact info
          return customerInfo.name.trim() !== '' && 
                 customerInfo.email.trim() !== '' && 
                 customerInfo.phone.trim() !== '' && 
                 customerInfo.address.trim() !== '';
        } else {
          // Buyback step 4: Functional status
          return functionalStatus.trim() !== '';
        }
      
      // Buyback only steps
      case 5:
        // Battery health
        return batteryHealth.trim() !== '';
      
      case 6:
        // Accessories (Other requires text)
        if (accessories === 'Other') {
          return otherAccessories.trim() !== '';
        }
        return accessories.trim() !== '';
      
      case 7:
        // Additional details (optional)
        return true;
      
      case 8:
        // Contact info
        return customerInfo.name.trim() !== '' && 
               customerInfo.email.trim() !== '' && 
               customerInfo.phone.trim() !== '' && 
               customerInfo.address.trim() !== '';
      
      default:
        return false;
    }
  };

  if (!deviceInfo) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Device Selected</CardTitle>
          <CardDescription>Please select a device first.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCancel} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`max-w-2xl mx-auto ${serviceType === 'buyback' ? 'border-green-200' : 'border-blue-200'}`}>
      <CardHeader className={serviceType === 'buyback' ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-blue-50 to-sky-50'}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={serviceType === 'buyback' ? 'text-green-900' : 'text-blue-900'}>
              {serviceType === 'repair' ? 'Device Repair Request' : 'Device Buyback Request'}
            </CardTitle>
            <CardDescription>
              Step {currentStep} of {getTotalSteps()}
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${serviceType === 'buyback' ? 'bg-green-600' : 'bg-blue-600'}`}
            style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStepContent()}
        
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep === getTotalSteps() ? (
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={serviceType === 'buyback' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {isSubmitting ? 'Submitting...' : `Submit ${serviceType === 'repair' ? 'Repair' : 'Buyback'} Request`}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className={serviceType === 'buyback' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
