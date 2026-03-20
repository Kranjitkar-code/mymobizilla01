import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useContentItem } from '@/contexts/ContentContext';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/ui/Logo';
import { useEffect, useMemo, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import DeviceBrowserSection from '@/components/sections/DeviceBrowserSection';

export default function Home() {
  const location = useLocation();

  // Get content from CMS with fallbacks
  const heroTitle = useContentItem('home-hero-title', 'Your One-Stop Solution for Mobile Repairs & Buyback');
  const heroSubtitle = useContentItem('home-hero-subtitle', 'Expert technicians, genuine parts, and hassle-free service for all your device needs.');
  const whyChooseTitle = useContentItem('home-why-choose-title', 'Why Choose Mobizilla?');
  const whyChooseSubtitle = useContentItem('home-why-choose-subtitle', 'Experience the difference with our modern approach to mobile care.');

  // Hero banner carousel
  const bannerImages = ['/images/01.webp', '/images/02.webp', '/images/03.webp', '/images/04.webp', '/images/05.webp', '/images/06.webp'];
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
        <title>Mobizilla - Repair, Buy & Sell All Things Mobile</title>
        <meta name="description" content="AI-assisted diagnostics, genuine parts, and transparent pricing. Your trusted mobile experts." />
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
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {bannerImages.map((src, idx) => {
                    const repairIndexes = [0, 1, 3];
                    const to = repairIndexes.includes(idx) ? '/repair' : '/buyback';
                    return (
                      <CarouselItem key={idx}>
                        <Link to={to} aria-label={`banner-link-${idx + 1}`}>
                          <div className="w-full aspect-[16/9] sm:aspect-auto sm:h-[420px]">
                            <img
                              src={src}
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
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="-left-4 sm:-left-10 bg-white/90" />
                <CarouselNext className="-right-4 sm:-right-10 bg-white/90" />
              </Carousel>
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

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{whyChooseTitle}</h2>
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 md:gap-8 bg-gray-50 rounded-2xl p-4 md:p-6 border">
              <div className="w-full max-w-[340px] md:max-w-[360px] mx-auto rounded-xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '9 / 16' }}>
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/bE4zoJWuauU?si=os7cFKaru7adn8iC"
                  title="Mobizilla Video 1"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="w-full max-w-[340px] md:max-w-[360px] mx-auto rounded-xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '9 / 16' }}>
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/GNZ3UcbMuPc"
                  title="Mobizilla Video 2"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">{whyChooseSubtitle}</p>

          {/* Features Grid - larger icons with better contrast */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-blue-600 text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Genuine Parts</h3>
              <p className="text-sm text-gray-600">Quality spares sourced from trusted vendors</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-green-600 text-3xl">🛡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-sm text-gray-600">Your data and device protected at every step</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-purple-600 text-3xl">🔧</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Warranty on Repairs</h3>
              <p className="text-sm text-gray-600">Up to 3-6 months on most repairs</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-orange-600 text-3xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick TAT</h3>
              <p className="text-sm text-gray-600">Pickup, repair and deliver — often same day</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}