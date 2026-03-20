
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContentItem } from '@/contexts/ContentContext';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Building2,
  CheckCircle,
  Star,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get content from CMS with fallbacks
  const contactPhone = useContentItem('contact-phone', '+977-1-5354999');
  const contactEmail = useContentItem('contact-email', 'mobizillanepal@gmail.com');
  const contactAddress = useContentItem('contact-address', 'Ratna Plaza, New Road, Kathmandu 44600, Nepal');
  const aboutUsDescription = useContentItem('about-us-description', 'Mobizilla is your trusted partner for all device repair needs. With years of experience and certified technicians, we provide quality service you can rely on.');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use /api endpoint which works in both dev (proxied to localhost:5003) and production (Netlify function)
      const apiUrl = import.meta.env.DEV
        ? 'http://localhost:5003/api/send-contact-email'
        : '/api/send-contact-email';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          service: formData.service,
          message: formData.message,
          to: contactEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: "Message Sent Successfully! ✅",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Failed to Send Message",
        description: "Something went wrong. Please try again or contact us directly by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: MapPin,
      title: "Visit Our Center",
      value: contactAddress,
      description: "Conveniently located in New Road",
      action: "https://maps.google.com/?q=27.7050,85.3131",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      btnText: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us Anytime",
      value: contactPhone,
      description: "Mon-Sat from 9AM to 8PM",
      action: `tel:${contactPhone.replace(/[^0-9]/g, '')}`,
      color: "text-green-600",
      bgColor: "bg-green-100",
      btnText: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      value: contactEmail,
      description: "We usually reply within 24 hours",
      action: `mailto:${contactEmail}`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      btnText: "Send Email"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Certified Experts",
      description: "Skilled technicians you can trust"
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "Most repairs done within 24 hours"
    },
    {
      icon: Star,
      title: "Quality Parts",
      description: "Genuine parts with warranty"
    }
  ];

  const services = [
    "Device Repair",
    "BuyBack Program",
    "Technical Training",
    "Device Sales",
    "Warranty Support",
    "General Inquiry"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Contact Us - Mobizilla</title>
        <meta name="description" content="Get in touch with Mobizilla for all your mobile device needs. Professional support, quick response, and quality service guaranteed." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-50 blur-3xl opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 text-sm border-blue-200">
            <MessageSquare className="h-4 w-4 mr-2" />
            We're Here to Help
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
            Get in Touch with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Mobizilla</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Have a broken device or need expert advice? Our team is ready to assist you with quick repairs, buybacks, and training queries.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm text-sm font-medium text-gray-700">
                <feature.icon className="w-4 h-4 text-green-500" />
                {feature.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left Side: Contact Form */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <CardHeader className="pb-2 pt-8 px-8">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      Send us a Message
                    </CardTitle>
                    <p className="text-gray-500 mt-2">Fill out the form below and our team will get back to you shortly.</p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+977-1-5354999"
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="service" className="text-sm font-medium text-gray-700">Interest</label>
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 rounded-md border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:border-input text-sm"
                            required
                          >
                            <option value="">Select Service</option>
                            {services.map((service) => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="How can we help you today?"
                          className="min-h-40 bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-300"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Map Section - Moved here for better mobile flow, or keep at bottom */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456!2d85.3131!3d27.7050!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1907!2sNew%20Road%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Mobizilla Location"
                  ></iframe>
                </div>
              </div>

              {/* Right Side: Info & Widgets */}
              <div className="space-y-6">

                {/* Contact Methods Cards */}
                <div className="grid gap-4">
                  {contactMethods.map((method, index) => (
                    <a key={index} href={method.action} className="block group">
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${method.bgColor}`}>
                          <method.icon className={`h-6 w-6 ${method.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{method.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                          <span className={`text-xs font-semibold uppercase tracking-wider ${method.color} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                            {method.btnText} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Updated Business Hours from Reference */}
                <Card className="border shadow-lg bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700 font-medium text-sm">Mon - Sat</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                          9:00 AM - 8:00 PM
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg border border-dashed border-gray-200">
                        <span className="text-gray-500 font-medium text-sm">Sunday</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full uppercase tracking-wide">
                          Closed
                        </span>
                      </div>

                      <div className="pt-4 mt-2 border-t border-gray-100">
                        <div className="flex items-start gap-3 mt-1">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-600 leading-tight">
                            Available for <span className="font-semibold text-gray-900">Emergency Repairs</span> upon request.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Improved Quick Actions */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" /> Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdH99rXhXqpxtzTmCgzMaFXwWUYOj6gqVoaebgBgY6T-E1R4g/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                          <Phone className="h-5 w-5 text-blue-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-blue-700">Book a Repair</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-600" />
                      </a>

                      <Link
                        to="/track"
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-600 transition-colors">
                          <MessageSquare className="h-5 w-5 text-purple-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-purple-700">Track Order</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-purple-600" />
                      </Link>

                      <Link
                        to="/buyback"
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="bg-amber-100 p-2 rounded-lg group-hover:bg-amber-600 transition-colors">
                          <Star className="h-5 w-5 text-amber-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-amber-700">Get Quote</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-amber-600" />
                      </Link>
                    </div>
                  </div>
                </Card>

              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
