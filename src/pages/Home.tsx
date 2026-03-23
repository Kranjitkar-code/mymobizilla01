import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useContentItem } from '@/contexts/ContentContext';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import DeviceBrowserSection from '@/components/sections/DeviceBrowserSection';
import SupabaseBannersService from '@/services/supabaseBannersService';
import SupabaseWhyChooseService, { type WhyChooseRow } from '@/services/supabaseWhyChooseService';
import SupabaseVideosService from '@/services/supabaseVideosService';
import SupabaseServicesService, { type ServiceRow } from '@/services/supabaseServicesService';
import SupabaseTestimonialsService, { type TestimonialRow } from '@/services/supabaseTestimonialsService';
import SupabaseTeamService, { type TeamMemberRow } from '@/services/supabaseTeamService';
import SupabaseFaqService, { type FaqItem } from '@/services/supabaseFaqService';

const DEFAULT_BANNERS = [
  { image_url: '/images/01.webp', link_url: '/repair' },
  { image_url: '/images/02.webp', link_url: '/buyback' },
  { image_url: '/images/03.webp', link_url: '/repair' },
  { image_url: '/images/04.webp', link_url: '/repair' },
  { image_url: '/images/05.webp', link_url: '/buyback' },
  { image_url: '/images/06.webp', link_url: '/buyback' },
];

const DEFAULT_WHY_CHOOSE = [
  { title: 'Genuine Parts', description: 'Quality spares sourced from trusted vendors', icon_url: '✓', _color: 'blue' },
  { title: 'Safe & Secure', description: 'Your data and device protected at every step', icon_url: '🛡', _color: 'green' },
  { title: 'Warranty on Repairs', description: 'Up to 3-6 months on most repairs', icon_url: '🔧', _color: 'purple' },
  { title: 'Quick TAT', description: 'Pickup, repair and deliver — often same day', icon_url: '⚡', _color: 'orange' },
];

const DEFAULT_VIDEOS = [
  { title: 'Mobizilla Video 1', video_url: 'https://www.youtube.com/embed/bE4zoJWuauU?si=os7cFKaru7adn8iC' },
  { title: 'Mobizilla Video 2', video_url: 'https://www.youtube.com/embed/GNZ3UcbMuPc' },
];

const DEFAULT_SERVICES: { title: string; description: string; price_range: string; icon: string }[] = [
  { title: 'Screen Replacement', description: 'Professional screen replacement for all smartphone models with genuine parts', price_range: '₨1,500 - ₨8,000', icon: '📱' },
  { title: 'Battery Replacement', description: 'High-quality battery replacement with 1-year warranty', price_range: '₨800 - ₨3,500', icon: '🔋' },
  { title: 'Water Damage Repair', description: 'Expert water damage treatment and motherboard repair', price_range: '₨3,999+', icon: '💧' },
];

const DEFAULT_TESTIMONIALS: { name: string; content: string; rating: number }[] = [
  { name: 'Rajesh K.', content: 'Got my iPhone screen replaced here. Excellent work and the price was very fair. Highly recommended!', rating: 5 },
  { name: 'Suman S.', content: 'Sold my old Samsung phone through their buyback program. Fast payment and smooth process.', rating: 4 },
  { name: 'Priya M.', content: 'The team is very professional. They fixed my water-damaged phone when others said it was impossible!', rating: 5 },
];

const DEFAULT_TEAM: { name: string; role: string; photo_url: string | null }[] = [
  { name: 'Mobizilla Team', role: 'Expert Technicians', photo_url: null },
];

const DEFAULT_FAQS: { question: string; answer: string }[] = [
  { question: 'What products do you sell?', answer: 'We offer a wide range of mobile phones, phone accessories, and replacement parts (screens, batteries, charging ports, etc.).' },
  { question: 'Do you provide repair services?', answer: 'Yes, we offer repair services for various mobile phone issues such as screen replacements, battery issues, charging problems, and more.' },
  { question: 'How do I schedule a repair?', answer: 'You can schedule a repair directly through our website by selecting your phone model and describing the issue.' },
  { question: 'Do you offer warranties on repairs and parts?', answer: 'Yes, we offer a warranty on both repairs and parts. Warranty periods vary depending on the type of service or part purchased.' },
];

const WHY_CHOOSE_COLORS = ['blue', 'green', 'purple', 'orange', 'sky', 'amber', 'rose', 'teal'];

export default function Home() {
  const location = useLocation();

  // Get content from CMS with fallbacks
  const heroTitle = useContentItem('home-hero-title', 'Your One-Stop Solution for Mobile Repairs & Buyback');
  const heroSubtitle = useContentItem('home-hero-subtitle', 'Expert technicians, genuine parts, and hassle-free service for all your device needs.');
  const whyChooseTitle = useContentItem('home-why-choose-title', 'Why Choose Mobizilla?');
  const whyChooseSubtitle = useContentItem('home-why-choose-subtitle', 'Experience the difference with our modern approach to mobile care.');

  // Hero banner carousel — Supabase-backed
  const [banners, setBanners] = useState<{ image_url: string; link_url: string }[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Why Choose Us — Supabase-backed
  const [whyChooseItems, setWhyChooseItems] = useState<(WhyChooseRow | typeof DEFAULT_WHY_CHOOSE[0])[]>([]);
  const [whyChooseLoading, setWhyChooseLoading] = useState(true);

  // Videos — Supabase-backed
  const [videos, setVideos] = useState<{ title: string; video_url: string }[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  // Services — Supabase-backed
  const [services, setServices] = useState<{ title: string; description: string; price_range: string; icon: string }[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Testimonials — Supabase-backed
  const [testimonials, setTestimonials] = useState<{ name: string; content: string; rating: number; image_url?: string | null }[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Team — Supabase-backed
  const [team, setTeam] = useState<{ name: string; role: string; photo_url: string | null }[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  // FAQ — Supabase-backed
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

  useEffect(() => {
    SupabaseBannersService.getActiveBanners().then(rows => {
      setBanners(rows.length > 0
        ? rows.map(r => ({ image_url: r.image_url || '/placeholder.svg', link_url: r.link_url || '/repair' }))
        : DEFAULT_BANNERS);
      setBannersLoading(false);
    });
    SupabaseWhyChooseService.getAll().then(rows => {
      setWhyChooseItems(rows.length > 0 ? rows : DEFAULT_WHY_CHOOSE);
      setWhyChooseLoading(false);
    });
    SupabaseVideosService.getAll().then(rows => {
      setVideos(rows.length > 0
        ? rows.map(r => ({ title: r.title, video_url: r.video_url }))
        : DEFAULT_VIDEOS);
      setVideosLoading(false);
    });
    SupabaseServicesService.getAll().then(rows => {
      setServices(rows.length > 0
        ? rows.map(r => ({ title: r.title, description: r.description || '', price_range: r.price_range || '', icon: r.icon || '🔧' }))
        : DEFAULT_SERVICES);
      setServicesLoading(false);
    });
    SupabaseTestimonialsService.getAll().then(rows => {
      setTestimonials(rows.length > 0
        ? rows.map(r => ({ name: r.name, content: r.content || '', rating: r.rating || 5, image_url: r.image_url }))
        : DEFAULT_TESTIMONIALS);
      setTestimonialsLoading(false);
    });
    SupabaseTeamService.getAll().then(rows => {
      setTeam(rows.length > 0
        ? rows.map(r => ({ name: r.name, role: r.role || '', photo_url: r.photo_url }))
        : DEFAULT_TEAM);
      setTeamLoading(false);
    });
    SupabaseFaqService.getAllFaqs().then(rows => {
      setFaqs(rows.length > 0
        ? rows.map(r => ({ question: r.question, answer: r.answer }))
        : DEFAULT_FAQS);
      setFaqsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!api || isHovered) return;
    const id = setInterval(() => api.scrollNext(), 2000);
    return () => clearInterval(id);
  }, [api, isHovered]);

  // Handle scroll to section from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');

    if (scrollTo) {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Mobizilla — Mobile Repair, Buyback & Training Kathmandu Nepal</title>
        <meta name="description" content="Nepal's #1 mobile repair center. Screen replacement, battery, water damage, buyback, and technician training. Located at Ratna Plaza, New Road, Kathmandu." />
        <link rel="canonical" href="https://mymobizilla.com/" />
      </Helmet>

      {/* Hero Section - Cashify-like with banner carousel */}
      <section className="relative bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center py-10 lg:py-16">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">{heroTitle}</h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sky-700 text-sm font-medium">Repair</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm font-medium">Sell</span>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl">{heroSubtitle}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700"><span>✓</span> Doorstep Pickup</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700"><span>✓</span> Best Price Assurance</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700"><span>✓</span> Instant Payment</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/repair">
                  <Button size="lg" className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-medium">Get Repair Quote</Button>
                </Link>
                <Link to="/buyback">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium">Sell Now</Button>
                </Link>
              </div>

              {/* Trust Indicators - consistent alignment and spacing */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-4 pt-6 items-stretch">
                <div className="w-[90px] lg:w-[110px] flex flex-col items-center p-3 bg-emerald-50 rounded-xl lg:items-start min-h-[100px]">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2 flex-shrink-0"><span className="text-emerald-600 text-base lg:text-lg font-semibold">✓</span></div>
                  <div className="text-center lg:text-left flex-1">
                    <p className="text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 leading-tight">Verified</p>
                    <p className="text-[10px] lg:text-xs text-gray-600 leading-tight">Trusted Partners</p>
                  </div>
                </div>
                <div className="w-[90px] lg:w-[110px] flex flex-col items-center p-3 bg-amber-50 rounded-xl lg:items-start min-h-[100px]">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-2 flex-shrink-0"><span className="text-amber-600 text-base lg:text-lg">★</span></div>
                  <div className="text-center lg:text-left flex-1">
                    <p className="text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 leading-tight">Top Rated</p>
                    <p className="text-[10px] lg:text-xs text-gray-600 leading-tight">Happy Customers</p>
                  </div>
                </div>
                <div className="w-[90px] lg:w-[110px] flex flex-col items-center p-3 bg-sky-50 rounded-xl lg:items-start min-h-[100px]">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-sky-100 rounded-lg flex items-center justify-center mb-2 flex-shrink-0"><span className="text-sky-600 text-base lg:text-lg">⚡</span></div>
                  <div className="text-center lg:text-left flex-1">
                    <p className="text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 leading-tight">Instant</p>
                    <p className="text-[10px] lg:text-xs text-gray-600 leading-tight">Same Day Pay</p>
                  </div>
                </div>
                <div className="w-[90px] lg:w-[110px] flex flex-col items-center p-3 bg-violet-50 rounded-xl lg:items-start min-h-[100px]">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-2 flex-shrink-0"><span className="text-violet-600 text-base lg:text-lg">🛡</span></div>
                  <div className="text-center lg:text-left flex-1">
                    <p className="text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 leading-tight">Secure</p>
                    <p className="text-[10px] lg:text-xs text-gray-600 leading-tight">Data Safe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Banner Carousel */}
            <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {bannersLoading ? (
                <Skeleton className="w-full aspect-[16/9] sm:aspect-auto sm:h-[420px] rounded-2xl" />
              ) : (
                <Carousel setApi={setApi} className="w-full">
                  <CarouselContent>
                    {banners.map((b, idx) => (
                      <CarouselItem key={idx}>
                        <Link to={b.link_url} aria-label={`banner-link-${idx + 1}`}>
                          <div className="w-full aspect-[16/9] sm:aspect-auto sm:h-[420px]">
                            <img
                              src={b.image_url}
                              alt={`banner-${idx + 1}`}
                              className="w-full h-full object-cover rounded-2xl border"
                              loading="eager"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 sm:-left-10 bg-white/90" />
                  <CarouselNext className="-right-4 sm:-right-10 bg-white/90" />
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Categories / Brands / Models */}
      <DeviceBrowserSection />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-gray-600">Our numbers speak for our quality and reliability</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <p className="text-gray-600">Devices Repaired</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">24hr</div>
              <p className="text-gray-600">Average TAT</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">3000+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Repair Services</h2>
            <p className="text-lg text-gray-600">Professional repair solutions for all your devices</p>
          </div>
          {servicesLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-12 w-12 rounded-xl mb-4" /><Skeleton className="h-5 w-40 mb-2" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{s.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{s.description}</p>
                    {s.price_range && <p className="text-sm font-medium text-blue-600">{s.price_range}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real reviews from real customers</p>
          </div>
          {testimonialsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4 mb-4" /><Skeleton className="h-4 w-24" /></CardContent></Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {t.image_url ? (
                        <img src={t.image_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <div className="flex text-amber-400 text-sm">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>{i < t.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{t.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{whyChooseTitle}</h2>
          <div className="max-w-4xl mx-auto mb-12">
            {videosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 md:gap-8 bg-gray-50 rounded-2xl p-4 md:p-6 border">
                <Skeleton className="w-full max-w-[340px] md:max-w-[360px] mx-auto rounded-xl" style={{ aspectRatio: '9 / 16' }} />
                <Skeleton className="w-full max-w-[340px] md:max-w-[360px] mx-auto rounded-xl" style={{ aspectRatio: '9 / 16' }} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 md:gap-8 bg-gray-50 rounded-2xl p-4 md:p-6 border">
                {videos.map((v, idx) => (
                  <div key={idx} className="w-full max-w-[340px] md:max-w-[360px] mx-auto rounded-xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '9 / 16' }}>
                    <iframe
                      className="w-full h-full"
                      src={v.video_url}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">{whyChooseSubtitle}</p>

          {/* Features Grid - larger icons with better contrast */}
          {whyChooseLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <Skeleton className="w-20 h-20 rounded-2xl mx-auto mb-4" />
                  <Skeleton className="h-5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseItems.map((item, idx) => {
                const color = ('_color' in item && item._color) ? item._color : WHY_CHOOSE_COLORS[idx % WHY_CHOOSE_COLORS.length];
                const icon = item.icon_url || '✓';
                const isEmoji = icon.length <= 2 || /\p{Emoji}/u.test(icon);
                return (
                  <div key={idx} className="text-center">
                    <div className={`w-20 h-20 bg-${color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                      {isEmoji ? (
                        <span className={`text-${color}-600 text-3xl`}>{icon}</span>
                      ) : (
                        <img src={icon} alt={item.title} className="w-10 h-10 object-contain" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Team Members Section */}
      <section id="team" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The experts behind every repair</p>
          </div>
          {teamLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="text-center"><Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" /><Skeleton className="h-5 w-32 mx-auto mb-2" /><Skeleton className="h-4 w-24 mx-auto" /></div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m, idx) => (
                <div key={idx} className="text-center">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200" />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-2 border-gray-200">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">{m.name}</h3>
                  <p className="text-sm text-gray-600">{m.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Got questions? We've got answers.</p>
          </div>
          {faqsLoading ? (
            <div className="space-y-4">
              {[0, 1, 2, 3].map(i => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 whitespace-pre-wrap">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </div>
  );
}