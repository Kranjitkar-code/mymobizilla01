import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Shield,
  Clock,
  Zap,
  Smartphone,
  Tablet,
  Laptop,
  DollarSign,
  GraduationCap,
  Camera,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContentItem } from '@/contexts/ContentContext';

const services = [
  {
    id: 'repair',
    title: 'services-repair-title',
    icon: Wrench,
    description: 'services-repair-description',
    features: [
      'Screen replacement and display fixes',
      'Battery replacement and charging issues',
      'Water damage repair and recovery',
      'Camera and speaker repairs',
      'Software troubleshooting',
      'Hardware component replacement'
    ],
    devices: ['Smartphones', 'Tablets', 'Laptops'],
    pricing: 'Starting from ₨800',
    warranty: '6 months to 1 year warranty',
    link: '/repair',
    status: 'available'
  },
  {
    id: 'buyback',
    title: 'services-buyback-title',
    icon: DollarSign,
    description: 'services-buyback-description',
    features: [
      'Instant online quotations',
      'Free device evaluation',
      'Immediate payment processing',
      'Any condition accepted',
      'Secure data wiping',
      'Hassle-free pickup service'
    ],
    devices: ['Smartphones', 'Tablets', 'Laptops', 'Accessories'],
    pricing: 'Competitive market rates',
    warranty: 'Secure transaction guarantee',
    link: '/buyback',
    status: 'available'
  },
  {
    id: 'training',
    title: 'services-training-title',
    icon: GraduationCap,
    description: 'services-training-description',
    features: [
      'Hands-on practical training',
      'Professional certification',
      'Tools and equipment included',
      'Expert instructor guidance',
      'Real device practice',
      'Job placement assistance'
    ],
    devices: ['Mobile Repair', 'Laptop Repair', 'Advanced Techniques'],
    pricing: 'Course packages available',
    warranty: 'Skill certification provided',
    link: '/training',
    status: 'available'
  },
  {
    id: 'store',
    title: 'services-store-title',
    icon: Smartphone,
    description: 'services-store-description',
    features: [
      'Latest smartphones and tablets',
      'Genuine accessories',
      'Competitive pricing',
      'Manufacturer warranty',
      'Fast delivery service',
      'Expert product guidance'
    ],
    devices: ['Smartphones', 'Tablets', 'Laptops', 'Accessories'],
    pricing: 'Best market prices',
    warranty: 'Full manufacturer warranty',
    link: '/buy',
    status: 'coming_soon'
  }
];

const features = [
  {
    icon: Shield,
    title: 'Genuine Parts',
    description: 'We use only original and high-quality replacement parts'
  },
  {
    icon: Clock,
    title: 'Quick Turnaround',
    description: 'Most repairs completed within 24-48 hours'
  },
  {
    icon: Award,
    title: 'Expert Technicians',
    description: 'Certified professionals with years of experience'
  },
  {
    icon: CheckCircle,
    title: 'Quality Guarantee',
    description: 'All services come with comprehensive warranty'
  }
];

export default function Services() {
  // Get content from CMS with fallbacks
  const pageTitle = useContentItem('services-page-title', 'Our Services');
  const pageSubtitle = useContentItem('services-page-subtitle', 'From professional repairs to technical training, we provide comprehensive solutions for all your mobile device needs with expert care and quality guarantee.');
  const contactPhone = useContentItem('contact-phone', '+977-1-5354999');
  const contactEmail = useContentItem('contact-email', 'mobizillanepal@gmail.com');

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Our Services - Professional Device Solutions | Mobizilla</title>
        <meta name="description" content="Complete range of mobile device services including repair, buyback, training, and device sales at Mobizilla. Professional, reliable, and affordable." />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Hero Section - Content managed by CMS */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{pageTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {pageSubtitle}
          </p>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Grid - Content managed by CMS */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const Icon = service.icon;
            // Provide specific fallbacks for each service type
            const getServiceFallbackTitle = (serviceId: string) => {
              switch (serviceId) {
                case 'repair': return 'Device Repair Services';
                case 'buyback': return 'Device BuyBack Program';
                case 'training': return 'Technical Training Courses';
                case 'store': return 'Device Store & Accessories';
                default: return 'Professional Services';
              }
            };

            const getServiceFallbackDescription = (serviceId: string) => {
              switch (serviceId) {
                case 'repair': return 'Professional repair services for all your devices with expert technicians and genuine parts.';
                case 'buyback': return 'Get instant quotes and fair prices for your old devices with our hassle-free buyback service.';
                case 'training': return 'Professional mobile repair training courses with hands-on experience and certification.';
                case 'store': return 'Browse and purchase the latest smartphones, tablets, and accessories at competitive prices.';
                default: return 'Professional services for all your mobile device needs.';
              }
            };

            const serviceTitle = useContentItem(service.title, getServiceFallbackTitle(service.id));
            const serviceDescription = useContentItem(service.description, getServiceFallbackDescription(service.id));

            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{serviceTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {service.status === 'available' ? (
                          <Badge className="bg-green-100 text-green-800">Available Now</Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-300 text-orange-600">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{serviceDescription}</p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">What We Offer:</h4>
                    <ul className="space-y-1">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Device Types */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Device Types:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.devices.map((device, index) => (
                        <Badge key={index} variant="outline">{device}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Warranty */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Pricing:</span>
                      <p className="text-gray-600">{service.pricing}</p>
                    </div>
                    <div>
                      <span className="font-medium">Warranty:</span>
                      <p className="text-gray-600">{service.warranty}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={service.link}>
                    <Button
                      className="w-full"
                      disabled={service.status === 'coming_soon'}
                    >
                      {service.status === 'available' ? 'Learn More' : 'Coming Soon'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section - Content managed by CMS */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-6">
              Our expert team is here to help you find the perfect solution for your device needs.
              Contact us for personalized recommendations and quotes.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-6">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Call Us</p>
                  <a href={`tel:${contactPhone.replace(/[^0-9]/g, '')}`} className="text-sm text-gray-600 hover:text-blue-600">{contactPhone}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Email Us</p>
                  <a href={`mailto:${contactEmail}`} className="text-sm text-gray-600 hover:text-blue-600">{contactEmail}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-gray-600">Mon-Sat: 9AM-8PM</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get in Touch
                </Button>
              </Link>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdH99rXhXqpxtzTmCgzMaFXwWUYOj6gqVoaebgBgY6T-E1R4g/viewform" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Book a Repair
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}