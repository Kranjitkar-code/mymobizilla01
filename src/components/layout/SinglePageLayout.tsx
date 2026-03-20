import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { repairAPI } from '@/api/repair';

// Device categories and models data
const DEVICE_CATEGORIES = [
  { value: 'phone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'laptop', label: 'Laptop' },
];

const PHONE_BRANDS = ['apple', 'samsung', 'google', 'oneplus', 'xiaomi', 'oppo', 'vivo'];
const TABLET_BRANDS = ['apple', 'samsung', 'lenovo', 'huawei', 'microsoft'];
const LAPTOP_BRANDS = ['apple', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'microsoft'];

const PHONE_MODELS = {
  apple: [
    { model: 'iPhone 15 Pro Max', basePrice: 85000 },
    { model: 'iPhone 15 Pro', basePrice: 75000 },
    { model: 'iPhone 15', basePrice: 65000 },
    { model: 'iPhone 14 Pro Max', basePrice: 70000 },
    { model: 'iPhone 14 Pro', basePrice: 60000 },
    { model: 'iPhone 14', basePrice: 50000 },
    { model: 'iPhone 13 Pro Max', basePrice: 55000 },
    { model: 'iPhone 13 Pro', basePrice: 45000 },
    { model: 'iPhone 13', basePrice: 40000 },
    { model: 'iPhone 12 Pro Max', basePrice: 45000 },
    { model: 'iPhone 12 Pro', basePrice: 38000 },
    { model: 'iPhone 12', basePrice: 35000 },
    { model: 'iPhone 11 Pro Max', basePrice: 35000 },
    { model: 'iPhone 11 Pro', basePrice: 30000 },
    { model: 'iPhone 11', basePrice: 25000 },
    { model: 'iPhone SE (2022)', basePrice: 25000 },
    { model: 'iPhone XS Max', basePrice: 25000 },
    { model: 'iPhone XS', basePrice: 20000 },
    { model: 'iPhone XR', basePrice: 18000 },
  ],
  samsung: [
    { model: 'Galaxy S23 Ultra', basePrice: 90000 },
    { model: 'Galaxy S23+', basePrice: 75000 },
    { model: 'Galaxy S23', basePrice: 65000 },
    { model: 'Galaxy Z Fold 5', basePrice: 120000 },
    { model: 'Galaxy Z Flip 5', basePrice: 80000 },
    { model: 'Galaxy S22 Ultra', basePrice: 70000 },
    { model: 'Galaxy S22+', basePrice: 60000 },
    { model: 'Galaxy S22', basePrice: 50000 },
    { model: 'Galaxy S21 Ultra', basePrice: 55000 },
    { model: 'Galaxy S21+', basePrice: 45000 },
    { model: 'Galaxy S21', basePrice: 40000 },
    { model: 'Galaxy Note 20 Ultra', basePrice: 50000 },
    { model: 'Galaxy Note 20', basePrice: 45000 },
    { model: 'Galaxy A54', basePrice: 30000 },
    { model: 'Galaxy A34', basePrice: 25000 },
    { model: 'Galaxy A14', basePrice: 15000 },
  ],
  google: [
    { model: 'Pixel 8 Pro', basePrice: 75000 },
    { model: 'Pixel 8', basePrice: 60000 },
    { model: 'Pixel 7 Pro', basePrice: 55000 },
    { model: 'Pixel 7', basePrice: 45000 },
    { model: 'Pixel 6 Pro', basePrice: 40000 },
    { model: 'Pixel 6', basePrice: 35000 },
    { model: 'Pixel 6a', basePrice: 30000 },
    { model: 'Pixel 5', basePrice: 25000 },
  ],
  oneplus: [
    { model: 'OnePlus 11', basePrice: 55000 },
    { model: 'OnePlus 11R', basePrice: 40000 },
    { model: 'OnePlus 10 Pro', basePrice: 50000 },
    { model: 'OnePlus 10T', basePrice: 45000 },
    { model: 'OnePlus 9 Pro', basePrice: 40000 },
    { model: 'OnePlus 9', basePrice: 35000 },
    { model: 'OnePlus 9RT', basePrice: 38000 },
    { model: 'OnePlus 8 Pro', basePrice: 35000 },
    { model: 'OnePlus 8', basePrice: 30000 },
    { model: 'OnePlus Nord 3', basePrice: 30000 },
    { model: 'OnePlus Nord CE 3', basePrice: 25000 },
    { model: 'OnePlus Nord 2T', basePrice: 28000 },
  ],
  xiaomi: [
    { model: 'Xiaomi 13 Pro', basePrice: 60000 },
    { model: 'Xiaomi 13', basePrice: 50000 },
    { model: 'Xiaomi 12 Pro', basePrice: 45000 },
    { model: 'Xiaomi 12', basePrice: 40000 },
    { model: 'Xiaomi 11T Pro', basePrice: 35000 },
    { model: 'Xiaomi 11i', basePrice: 30000 },
    { model: 'Redmi Note 12 Pro', basePrice: 25000 },
    { model: 'Redmi Note 12', basePrice: 20000 },
    { model: 'Redmi Note 11', basePrice: 18000 },
    { model: 'Redmi 12', basePrice: 15000 },
    { model: 'POCO F5', basePrice: 28000 },
    { model: 'POCO X5', basePrice: 20000 },
  ],
  oppo: [
    { model: 'Oppo Find X5 Pro', basePrice: 60000 },
    { model: 'Oppo Find X5', basePrice: 45000 },
    { model: 'Oppo Reno 10 Pro', basePrice: 35000 },
    { model: 'Oppo Reno 10', basePrice: 28000 },
    { model: 'Oppo Reno 8 Pro', basePrice: 30000 },
    { model: 'Oppo Reno 8', basePrice: 25000 },
    { model: 'Oppo A78', basePrice: 18000 },
    { model: 'Oppo A58', basePrice: 15000 },
    { model: 'Oppo A38', basePrice: 12000 },
  ],
  vivo: [
    { model: 'Vivo X90 Pro', basePrice: 65000 },
    { model: 'Vivo X90', basePrice: 50000 },
    { model: 'Vivo V29 Pro', basePrice: 35000 },
    { model: 'Vivo V29', basePrice: 30000 },
    { model: 'Vivo V27', basePrice: 28000 },
    { model: 'Vivo V25', basePrice: 25000 },
    { model: 'Vivo T2', basePrice: 20000 },
    { model: 'Vivo Y100', basePrice: 18000 },
    { model: 'Vivo Y56', basePrice: 15000 },
  ],
};

const TABLET_MODELS = {
  apple: [
    { model: 'iPad Pro 12.9" (2022)', basePrice: 90000 },
    { model: 'iPad Pro 12.9" (2021)', basePrice: 75000 },
    { model: 'iPad Pro 11" (2022)', basePrice: 70000 },
    { model: 'iPad Pro 11" (2021)', basePrice: 60000 },
    { model: 'iPad Air (2022)', basePrice: 50000 },
    { model: 'iPad Air (2020)', basePrice: 40000 },
    { model: 'iPad (2022)', basePrice: 35000 },
    { model: 'iPad (2021)', basePrice: 30000 },
    { model: 'iPad (2020)', basePrice: 25000 },
    { model: 'iPad Mini (2021)', basePrice: 40000 },
    { model: 'iPad Mini (2019)', basePrice: 30000 },
  ],
  samsung: [
    { model: 'Galaxy Tab S9 Ultra', basePrice: 85000 },
    { model: 'Galaxy Tab S9+', basePrice: 70000 },
    { model: 'Galaxy Tab S9', basePrice: 60000 },
    { model: 'Galaxy Tab S8 Ultra', basePrice: 75000 },
    { model: 'Galaxy Tab S8+', basePrice: 60000 },
    { model: 'Galaxy Tab S8', basePrice: 50000 },
    { model: 'Galaxy Tab S7+', basePrice: 50000 },
    { model: 'Galaxy Tab S7', basePrice: 40000 },
    { model: 'Galaxy Tab A8', basePrice: 20000 },
    { model: 'Galaxy Tab A7', basePrice: 15000 },
  ],
  lenovo: [
    { model: 'Tab P12 Pro', basePrice: 50000 },
    { model: 'Tab P11 Pro', basePrice: 40000 },
    { model: 'Tab P11', basePrice: 30000 },
    { model: 'Tab M10 Plus', basePrice: 20000 },
    { model: 'Tab M10', basePrice: 15000 },
    { model: 'Tab M8', basePrice: 10000 },
  ],
  huawei: [
    { model: 'MatePad Pro 12.6"', basePrice: 60000 },
    { model: 'MatePad Pro 11"', basePrice: 50000 },
    { model: 'MatePad 11"', basePrice: 35000 },
    { model: 'MatePad T10', basePrice: 15000 },
    { model: 'MediaPad M5', basePrice: 25000 },
  ],
  microsoft: [
    { model: 'Surface Pro 9', basePrice: 100000 },
    { model: 'Surface Pro 8', basePrice: 80000 },
    { model: 'Surface Pro 7+', basePrice: 70000 },
    { model: 'Surface Pro 7', basePrice: 60000 },
    { model: 'Surface Go 4', basePrice: 40000 },
    { model: 'Surface Go 3', basePrice: 35000 },
  ],
};

const LAPTOP_MODELS = {
  apple: [
    { model: 'MacBook Pro 16" (2023)', basePrice: 200000 },
    { model: 'MacBook Pro 14" (2023)', basePrice: 180000 },
    { model: 'MacBook Pro 16" (2021)', basePrice: 150000 },
    { model: 'MacBook Pro 14" (2021)', basePrice: 130000 },
    { model: 'MacBook Air 15" (2023)', basePrice: 120000 },
    { model: 'MacBook Air 13" (2022)', basePrice: 100000 },
    { model: 'MacBook Pro 13" (2022)', basePrice: 110000 },
    { model: 'MacBook Air (2020)', basePrice: 80000 },
    { model: 'MacBook Pro 16" (2019)', basePrice: 100000 },
    { model: 'MacBook Pro 13" (2020)', basePrice: 90000 },
  ],
  dell: [
    { model: 'XPS 17 (2023)', basePrice: 180000 },
    { model: 'XPS 15 (2023)', basePrice: 150000 },
    { model: 'XPS 13 (2023)', basePrice: 120000 },
    { model: 'XPS 17 (2022)', basePrice: 160000 },
    { model: 'XPS 15 (2022)', basePrice: 130000 },
    { model: 'XPS 13 (2022)', basePrice: 100000 },
    { model: 'Inspiron 16', basePrice: 80000 },
    { model: 'Inspiron 14', basePrice: 60000 },
    { model: 'Latitude 9430', basePrice: 140000 },
    { model: 'Latitude 7330', basePrice: 100000 },
    { model: 'Alienware m18', basePrice: 200000 },
    { model: 'Alienware x14', basePrice: 150000 },
  ],
  hp: [
    { model: 'Spectre x360 16"', basePrice: 150000 },
    { model: 'Spectre x360 14"', basePrice: 130000 },
    { model: 'Spectre x360 13"', basePrice: 110000 },
    { model: 'Envy x360 15"', basePrice: 90000 },
    { model: 'Envy x360 13"', basePrice: 80000 },
    { model: 'Pavilion Plus 14"', basePrice: 70000 },
    { model: 'Pavilion 15"', basePrice: 60000 },
    { model: 'Victus 16"', basePrice: 80000 },
    { model: 'OMEN 17"', basePrice: 120000 },
    { model: 'ZBook Firefly 14"', basePrice: 100000 },
  ],
  lenovo: [
    { model: 'ThinkPad X1 Carbon Gen 11', basePrice: 140000 },
    { model: 'ThinkPad X1 Yoga Gen 8', basePrice: 130000 },
    { model: 'ThinkPad X1 Nano Gen 3', basePrice: 120000 },
    { model: 'ThinkPad T14 Gen 4', basePrice: 100000 },
    { model: 'ThinkPad P16', basePrice: 180000 },
    { model: 'Yoga 9i Gen 8', basePrice: 120000 },
    { model: 'Yoga 7i Gen 8', basePrice: 90000 },
    { model: 'Legion Pro 7i', basePrice: 160000 },
    { model: 'Legion Slim 7i', basePrice: 130000 },
    { model: 'IdeaPad Slim 5', basePrice: 70000 },
  ],
  asus: [
    { model: 'ROG Zephyrus Duo 16', basePrice: 250000 },
    { model: 'ROG Zephyrus M16', basePrice: 180000 },
    { model: 'ROG Strix Scar 18', basePrice: 200000 },
    { model: 'ROG Flow X13', basePrice: 150000 },
    { model: 'Zenbook Pro 16X', basePrice: 170000 },
    { model: 'Zenbook Pro 14', basePrice: 140000 },
    { model: 'Zenbook S 13', basePrice: 100000 },
    { model: 'Vivobook Pro 16', basePrice: 90000 },
    { model: 'Vivobook S 14', basePrice: 70000 },
    { model: 'TUF Gaming F15', basePrice: 80000 },
  ],
  acer: [
    { model: 'Predator Helios 18', basePrice: 150000 },
    { model: 'Predator Helios 16', basePrice: 130000 },
    { model: 'Predator Triton 17', basePrice: 160000 },
    { model: 'Nitro 17', basePrice: 90000 },
    { model: 'Nitro 5', basePrice: 80000 },
    { model: 'Swift X 14', basePrice: 90000 },
    { model: 'Swift Go 14', basePrice: 70000 },
    { model: 'Swift 3', basePrice: 60000 },
    { model: 'Aspire 5', basePrice: 50000 },
    { model: 'Aspire 3', basePrice: 40000 },
  ],
  microsoft: [
    { model: 'Surface Laptop Studio', basePrice: 160000 },
    { model: 'Surface Laptop 5', basePrice: 120000 },
    { model: 'Surface Laptop 4', basePrice: 100000 },
    { model: 'Surface Laptop Go 2', basePrice: 70000 },
    { model: 'Surface Book 3', basePrice: 130000 },
  ],
};

const SERVICES = [
  {
    slug: 'screen-repair',
    icon: '📱',
    title: 'Screen Replacement',
    desc: 'Cracked or broken display repair'
  },
  {
    slug: 'battery-replacement',
    icon: '🔋',
    title: 'Battery Replacement',
    desc: 'Poor battery life solution'
  },
  {
    slug: 'charging-port',
    icon: '⚡',
    title: 'Charging Port Repair',
    desc: 'Fixing charging issues'
  },
  {
    slug: 'water-damage',
    icon: '💧',
    title: 'Water Damage Repair',
    desc: 'Liquid spill recovery'
  },
  {
    slug: 'camera-repair',
    icon: '📸',
    title: 'Camera Repair',
    desc: 'Blurry or broken camera fix'
  },
  {
    slug: 'software-issues',
    icon: '🖥️',
    title: 'Software Troubleshooting',
    desc: 'OS issues and bugs fix'
  }
];

const conditionEnum = ['excellent', 'good', 'fair', 'poor'];
const conditionMultipliers = {
  excellent: 0.85,
  good: 0.70,
  fair: 0.50,
  poor: 0.25
};

// Form schemas
const repairFormSchema = z.object({
  device_category: z.enum(['phone', 'tablet', 'laptop']),
  brand: z.string().min(1, "Please select a brand"),
  model: z.string().min(1, "Please select a model"),
  issue: z.string().min(1, "Please describe the issue"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  preferred_date: z.string().optional(),
});

const buybackFormSchema = z.object({
  device_category: z.enum(['phone', 'tablet', 'laptop']),
  brand: z.string().min(1, "Please select a brand"),
  model: z.string().min(1, "Please select a model"),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
});

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [repairStep, setRepairStep] = useState(0);
  const [buybackStep, setBuybackStep] = useState(0);
  const [repairLoading, setRepairLoading] = useState(false);
  const [repairPublicCode, setRepairPublicCode] = useState(null);
  const [repairError, setRepairError] = useState(null);
  const [buybackPublicCode, setBuybackPublicCode] = useState(null);
  const [services, setServices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // References for sections
  const sectionRefs = useRef({
    home: null,
    repair: null,
    buyback: null,
    training: null,
    services: null,
    contact: null,
  });

  // Scroll handler for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const repairForm = useForm({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      device_category: undefined,
      brand: '',
      model: '',
      issue: '',
      name: '',
      phone: '',
      email: '',
      preferred_date: '',
    }
  });

  const buybackForm = useForm({
    resolver: zodResolver(buybackFormSchema),
    defaultValues: {
      device_category: undefined,
      brand: '',
      model: '',
      condition: undefined,
      name: '',
      phone: '',
      email: '',
    }
  });

  const device_category = repairForm.watch("device_category") || buybackForm.watch("device_category");
  const brand = repairForm.watch("brand") || buybackForm.watch("brand");
  const model = repairForm.watch("model") || buybackForm.watch("model");
  const condition = buybackForm.watch("condition");

  // Helper functions
  const brandsByCategory = (category) => {
    switch(category) {
      case 'phone': return PHONE_BRANDS;
      case 'tablet': return TABLET_BRANDS;
      case 'laptop': return LAPTOP_BRANDS;
      default: return [];
    }
  };

  const modelsByBrand = (category, brand) => {
    if (!category || !brand) return [];
    
    switch(category) {
      case 'phone': return PHONE_MODELS[brand] || [];
      case 'tablet': return TABLET_MODELS[brand] || [];
      case 'laptop': return LAPTOP_MODELS[brand] || [];
      default: return [];
    }
  };

  const getBasePrice = (category, brand, modelName) => {
    const models = modelsByBrand(category, brand);
    const modelData = models.find(m => m.model === modelName);
    return modelData ? modelData.basePrice : 0;
  };

  const basePrice = getBasePrice(device_category, brand, model);
  const multiplier = condition ? conditionMultipliers[condition] : 1;
  const estimatedValue = Math.round(basePrice * multiplier);

  // Form submission handlers
  const onRepairSubmit = async (data) => {
    setRepairLoading(true);
    setRepairError(null);
    
    try {
      // Use the real Supabase repair API with notifications
      const result = await repairAPI.createBooking({
        device_category: data.device_category,
        brand: data.brand,
        model: data.model,
        issue: data.issue,
        customer_name: data.name,
        customer_email: data.email || '',
        customer_phone: data.phone,
        description: `Device: ${data.brand} ${data.model}, Issue: ${data.issue}`,
      });
      
      if (result.success) {
        setRepairPublicCode(result.tracking_code);
        setRepairStep(6);
        
        // Show success notifications
        toast({
          title: 'Booking Confirmed! 🎉',
          description: `Your repair booking has been created. Tracking code: ${result.tracking_code}`,
        });
        
        // Note: Real SMS and email notifications are sent automatically via Supabase Edge Function
        toast({
          title: 'Notifications Sent 📱📧',
          description: 'SMS and email confirmations have been sent to your phone and email.',
        });
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      setRepairError("Failed to book repair. Please try again.");
      console.error('Repair booking error:', error);
    } finally {
      setRepairLoading(false);
    }
  };

  const onBuybackSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random public code for demo
      const publicCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      setBuybackPublicCode(publicCode);
      setBuybackStep(6);
    } catch (error) {
      console.error("Buyback submission error:", error);
    }
  };

  // Fetch services and courses (simulated)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setServices([
          { id: 1, name: 'Screen Replacement', duration: '1-2 hours', description: 'Professional screen replacement with warranty', price: 49.99 },
          { id: 2, name: 'Battery Replacement', duration: '1 hour', description: 'Genuine battery replacement service', price: 39.99 },
          { id: 3, name: 'Water Damage Repair', duration: '2-3 days', description: 'Advanced cleaning and component replacement', price: 79.99 },
          { id: 4, name: 'Software Repair', duration: '30 mins - 2 hours', description: 'OS reinstall and software troubleshooting', price: 29.99 },
          { id: 5, name: 'Camera Repair', duration: '1-2 hours', description: 'Camera module replacement and calibration', price: 59.99 },
          { id: 6, name: 'Charging Port Repair', duration: '1 hour', description: 'Charging port replacement service', price: 44.99 },
        ]);

        setCourses([
          { id: 1, title: 'Basic Phone Repair', duration: '2 days', description: 'Learn fundamental phone repair techniques', price: 199 },
          { id: 2, title: 'Advanced Microsoldering', duration: '5 days', description: 'Master complex board-level repairs', price: 499 },
          { id: 3, title: 'Data Recovery Specialist', duration: '3 days', description: 'Learn professional data recovery methods', price: 349 },
          { id: 4, title: 'Business Management', duration: '2 days', description: 'Running a successful repair business', price: 249 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Repair form steps
  const repairSteps = [
    'Device Category',
    'Brand',
    'Model',
    'Issue',
    'Quotation',
    'Your Details',
    'Confirmation',
  ];

  // Buyback form steps
  const buybackSteps = [
    'Device Category',
    'Brand & Model',
    'Condition',
    'Quotation',
    'Your Details',
    'Confirmation',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-4">
          <ul className="flex justify-center space-x-6">
            {['home', 'repair', 'buyback', 'training', 'services', 'contact'].map((section) => (
              <li key={section}>
                <Button
                  variant="ghost"
                  className={`capitalize text-lg ${
                    activeSection === section ? 'text-primary font-bold border-b-2 border-primary' : 'text-gray-600'
                  }`}
                  onClick={() => {
                    if (section === 'repair') {
                      window.open('https://docs.google.com/forms/d/e/1FAIpQLSdH99rXhXqpxtzTmCgzMaFXwWUYOj6gqVoaebgBgY6T-E1R4g/viewform', '_blank');
                    } else {
                      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {section}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Home Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
          ref={(el) => (sectionRefs.current.home = el)}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary">Mobizilla</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your one-stop solution for device repairs, buybacks, and professional training.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdH99rXhXqpxtzTmCgzMaFXwWUYOj6gqVoaebgBgY6T-E1R4g/viewform', '_blank')}
              >
                Book a Repair
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('buyback')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Sell Your Device
              </Button>
            </div>
          </div>
        </section>

        {/* Repair Section */}
        <section
          id="repair"
          className="py-20 bg-gray-50"
          ref={(el) => (sectionRefs.current.repair = el)}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Repair Services</h2>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-10">
              {repairSteps.map((label, i) => (
                <div key={label} className={`flex items-center ${i < repairSteps.length - 1 ? 'w-40' : ''}`}>
                  <div
                    className={`rounded-full border-2 ${
                      repairStep >= i ? 'border-primary bg-primary text-white' : 'border-muted bg-white text-muted-foreground'
                    } w-8 h-8 flex items-center justify-center text-sm font-semibold`}
                  >
                    {i + 1}
                  </div>
                  {i < repairSteps.length - 1 && (
                    <div className={`flex-1 h-1 ${repairStep > i ? 'bg-primary' : 'bg-muted'}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-6 border">
              <Form {...repairForm}>
                <form
                  onSubmit={repairForm.handleSubmit(onRepairSubmit)}
                  className="space-y-6"
                  aria-label="Repair Booking Form"
                >
                  {/* Step 0: Device Category */}
                  {repairStep === 0 && (
                    <>
                      <FormField
                        control={repairForm.control}
                        name="device_category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Category</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEVICE_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => setRepairStep(1)}
                          disabled={!repairForm.getValues('device_category')}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 1: Brand */}
                  {repairStep === 1 && (
                    <>
                      <FormField
                        control={repairForm.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose brand" />
                                </SelectTrigger>
                                <SelectContent>
                                  {brandsByCategory(repairForm.getValues('device_category')).map((b) => (
                                    <SelectItem key={b} value={b}>
                                      {b.charAt(0).toUpperCase() + b.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="button" variant="secondary" onClick={() => setRepairStep(0)}>
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setRepairStep(2)}
                          disabled={!repairForm.getValues('brand')}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 2: Model */}
                  {repairStep === 2 && (
                    <>
                      <FormField
                        control={repairForm.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Model</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose model" />
                                </SelectTrigger>
                                <SelectContent>
                                  {modelsByBrand(repairForm.getValues('device_category'), repairForm.getValues('brand')).map(
                                    (m) => (
                                      <SelectItem key={m.model} value={m.model}>
                                        {m.model}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="button" variant="secondary" onClick={() => setRepairStep(1)}>
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setRepairStep(3)}
                          disabled={!repairForm.getValues('model')}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 3: Issue */}
                  {repairStep === 3 && (
                    <>
                      <FormField
                        control={repairForm.control}
                        name="issue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Issue</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select issue" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SERVICES.map((service) => (
                                    <SelectItem key={service.slug} value={service.slug}>
                                      {service.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="button" variant="secondary" onClick={() => setRepairStep(2)}>
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setRepairStep(4)}
                          disabled={!repairForm.getValues('issue')}
                        >
                          Get Quote
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 4: Quotation */}
                  {repairStep === 4 && (
                    <div className="text-center py-10">
                      <h3 className="text-xl font-semibold mb-2">Estimated Quotation</h3>
                      <div className="text-4xl font-bold text-primary mb-2">₨{Math.round(getBasePrice(device_category, brand, model) * 0.1)}</div>
                      <p className="text-muted-foreground mb-4">This is an estimate. Final price after inspection.</p>
                      <div className="flex justify-between">
                        <Button type="button" variant="secondary" onClick={() => setRepairStep(3)}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setRepairStep(5)}>
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 5: User Details */}
                  {repairStep === 5 && (
                    <>
                      <FormField
                        control={repairForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Mobile Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={repairForm.control}
                        name="preferred_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Pickup Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="button" variant="secondary" onClick={() => setRepairStep(4)}>
                          Back
                        </Button>
                        <Button type="submit" disabled={repairLoading}>
                          {repairLoading ? 'Booking...' : 'Book Repair'}
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 6: Confirmation */}
                  {repairStep === 6 && (
                    <div className="text-center py-12" aria-live="polite">
                      <div className="text-4xl mb-4">✅</div>
                      <h2 className="text-xl font-semibold mb-2">Booking Confirmed!</h2>
                      <p className="text-muted-foreground mb-2">
                        Thank you for choosing Mobizilla. SMS and email notifications have been sent.
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-blue-900 font-medium">📱 SMS sent to your phone number</p>
                        <p className="text-sm text-blue-900 font-medium">📧 Email confirmation sent to your email</p>
                      </div>
                      {repairPublicCode && (
                        <div className="mt-4">
                          <div className="font-mono text-lg">
                            Tracking Code: <span className="font-bold">{repairPublicCode}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Use this code to track your repair status.
                          </p>
                        </div>
                      )}
                      {repairError && <div className="text-xs text-destructive mt-2">{repairError}</div>}
                      <Button
                        className="mt-8"
                        onClick={() => {
                          setRepairStep(0);
                          setRepairPublicCode(null);
                          setRepairError(null);
                          repairForm.reset();
                        }}
                      >
                        Book Another
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </section>

        {/* Buyback Section */}
        <section
          id="buyback"
          className="py-20 bg-white"
          ref={(el) => (sectionRefs.current.buyback = el)}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Device Buyback</h2>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-10">
              {buybackSteps.map((label, i) => (
                <div key={label} className={`flex items-center ${i < buybackSteps.length - 1 ? 'w-40' : ''}`}>
                  <div
                    className={`rounded-full border-2 ${
                      buybackStep >= i ? 'border-primary bg-primary text-white' : 'border-muted bg-white text-muted-foreground'
                    } w-8 h-8 flex items-center justify-center text-sm font-semibold`}
                  >
                    {i + 1}
                  </div>
                  {i < buybackSteps.length - 1 && (
                    <div className={`flex-1 h-1 ${buybackStep > i ? 'bg-primary' : 'bg-muted'}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="max-w-xl mx-auto bg-white rounded shadow-sm p-6">
              <Form {...buybackForm}>
                <form
                  className="space-y-6"
                  aria-label="Buy Back Form"
                  onSubmit={buybackForm.handleSubmit(onBuybackSubmit)}
                >
                  {/* Step 0: Device Category */}
                  {buybackStep === 0 && (
                    <>
                      <FormField
                        name="device_category"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Category</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEVICE_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          onClick={() => setBuybackStep(1)}
                          disabled={!buybackForm.getValues('device_category')}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 1: Brand/Model */}
                  {buybackStep === 1 && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          name="brand"
                          control={buybackForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select brand" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {brandsByCategory(buybackForm.getValues('device_category')).map((b) => (
                                      <SelectItem key={b} value={b}>
                                        {b.charAt(0).toUpperCase() + b.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="model"
                          control={buybackForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Model</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select model" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {modelsByBrand(buybackForm.getValues('device_category'), buybackForm.getValues('brand')).map(
                                      (m) => (
                                        <SelectItem key={m.model} value={m.model}>
                                          {m.model}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setBuybackStep(0)}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setBuybackStep(2)}
                          disabled={!buybackForm.getValues('brand') || !buybackForm.getValues('model')}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 2: Condition Assessment */}
                  {buybackStep === 2 && (
                    <>
                      <FormField
                        name="condition"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Condition</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excellent">Excellent — Like new, no issues</SelectItem>
                                  <SelectItem value="good">Good — Minor wear, fully functional</SelectItem>
                                  <SelectItem value="fair">Fair — Noticeable wear, some issues</SelectItem>
                                  <SelectItem value="poor">Poor — Major issues or damage</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between mt-4">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setBuybackStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setBuybackStep(3)}
                          disabled={!buybackForm.getValues('condition')}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 3: Instant Quote */}
                  {buybackStep === 3 && (
                    <>
                      <div className="text-center py-6">
                        <div className="text-lg font-semibold mb-2">Estimated Value</div>
                        <div className="text-3xl font-bold mb-2">₨{estimatedValue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mb-4">
                          Based on device, condition, and market demand. Final value after inspection.
                        </div>
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setBuybackStep(2)}
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setBuybackStep(4)}
                            disabled={estimatedValue <= 0}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 4: Pickup & Contact Info */}
                  {buybackStep === 4 && (
                    <>
                      <FormField
                        name="name"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="phone"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="98xxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setBuybackStep(3)}
                        >
                          Back
                        </Button>
                        <Button type="submit">Submit</Button>
                      </div>
                    </>
                  )}

                  {/* Step 5: Confirmation */}
                  {buybackStep === 5 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🎉</div>
                      <h2 className="text-xl font-semibold mb-2">Request Submitted!</h2>
                      <p className="text-muted-foreground mb-2">
                        Thank you for choosing Mobizilla. Our team will contact you soon for pickup and payment.
                      </p>
                      {buybackPublicCode && (
                        <div className="mt-4">
                          <div className="font-mono text-lg">
                            Tracking Code: <span className="font-bold">{buybackPublicCode}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Use this code for any queries about your buy-back request.
                          </p>
                        </div>
                      )}
                      <Button
                        className="mt-8"
                        onClick={() => {
                          setBuybackStep(0);
                          setBuybackPublicCode(null);
                          buybackForm.reset();
                        }}
                      >
                        Sell Another Device
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </section>

        {/* Training Section */}
        <section
          id="training"
          className="py-20 bg-gray-50"
          ref={(el) => (sectionRefs.current.training = el)}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Training Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Available Courses</h3>
                <div className="space-y-4">
                  {loading ? (
                    <p>Loading courses...</p>
                  ) : (
                    courses.map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-gray-600 text-sm">{course.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-primary font-bold">${course.price}</span>
                            <span className="text-sm text-gray-500">{course.duration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Enroll in a Course</CardTitle>
                    <CardDescription>Start your journey in device repair</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...buybackForm}>
                      <form className="space-y-4">
                        <FormField
                          name="device_category"
                          control={buybackForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Course</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {courses.map((course) => (
                                      <SelectItem key={course.id} value={course.id}>
                                        {course.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="name"
                          control={buybackForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="email"
                          control={buybackForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="phone"
                          control={buybackForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Enroll Now
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="py-20 bg-white"
          ref={(el) => (sectionRefs.current.services = el)}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <p>Loading services...</p>
              ) : (
                services.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{service.description}</CardDescription>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">${service.price}</span>
                        <span className="text-sm text-gray-500">{service.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 bg-gray-50"
          ref={(el) => (sectionRefs.current.contact = el)}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
            <div className="max-w-xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>We'd love to hear from you</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...buybackForm}>
                    <form className="space-y-4">
                      <FormField
                        name="name"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="name"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="email"
                        control={buybackForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Your message" rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;