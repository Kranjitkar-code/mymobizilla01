import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { useLazyContentItem } from '@/contexts/ContentContext';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/ui/Logo';
import InViewContentSection from '@/components/content/InViewContentSection';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import DeviceBrowserSection from '@/components/sections/DeviceBrowserSection';

// Lazy content components
const LazyHeroSection = () => {
  const heroTitle = useLazyContentItem('home-hero-title', 'Sell Old Phone');
  const heroSubtitle = useLazyContentItem(
    'home-hero-subtitle',
    'From your doorstep or at any of our partner stores'
  );

  const bannerImages = ['/images/01.webp', '/images/02.webp', '/images/03.webp', '/images/04.webp', '/images/05.webp', '/images/06.webp'];
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api || isHovered) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 2000);
    return () => clearInterval(id);
  }, [api, isHovered]);

  return (
    <section className="relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center py-10 lg:py-16">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
              {heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl">{heroSubtitle}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <span>✓</span> Doorstep Pickup
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <span>✓</span> Best Price Assurance
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <span>✓</span> Instant Payment
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdH99rXhXqpxtzTmCgzMaFXwWUYOj6gqVoaebgBgY6T-E1R4g/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium">
                  Sell Now
                </Button>
              </a>
              <Link to="/buyback">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium">
                  Check Price
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-2">
                  <span className="text-emerald-600 text-lg font-semibold">✓</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Verified</p>
                <p className="text-xs text-gray-600">Trusted Partners</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-2">
                  <span className="text-amber-600 text-lg">★</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Top Rated</p>
                <p className="text-xs text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-2">
                  <span className="text-sky-600 text-lg">⚡</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Instant</p>
                <p className="text-xs text-gray-600">Same Day Pay</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-2">
                  <span className="text-violet-600 text-lg">🛡</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Secure</p>
                <p className="text-xs text-gray-600">Data Safe</p>
              </div>
            </div>
          </div>

          {/* Right Content - Banner Carousel */}
          <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {bannerImages.map((src, idx) => (
                  <CarouselItem key={idx} className="">
                    <img
                      src={src}
                      alt={`banner-${idx + 1}`}
                      className="w-full h-[360px] sm:h-[420px] object-cover rounded-2xl border"
                      loading="eager"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 sm:-left-10 bg-white/90" />
              <CarouselNext className="-right-4 sm:-right-10 bg-white/90" />
            </Carousel>
          </div>
        </div>

        {/* Categories strip (Cashify-like quick actions) */}
        <div className="overflow-x-auto py-4 -mx-4 px-4">
          <div className="flex gap-4 min-w-max">
            {[
              { label: 'All', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Sell Phone', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Buy Refurbished', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Repair', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Accessories', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Find Store', color: 'bg-emerald-50 text-emerald-700' },
            ].map((item) => (
              <button key={item.label} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border ${item.color}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LazyStatsSection = () => {
  const { elementRef, hasBeenInView } = useInView({ rootMargin: '100px' });
  
  return (
    <section ref={elementRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <InViewContentSection 
              contentKey="home-stats-title" 
              fallback="Trusted by Thousands"
            />
          </h2>
          <p className="text-lg text-gray-600">
            <InViewContentSection 
              contentKey="home-stats-subtitle" 
              fallback="Our numbers speak for our quality and reliability"
            />
          </p>
        </div>
        
        {hasBeenInView && (
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
        )}
      </div>
    </section>
  );
};

const LazyWhyChooseSection = () => {
  const whyChooseTitle = useLazyContentItem('home-why-choose-title', 'Why Choose Mobizilla?');
  const whyChooseSubtitle = useLazyContentItem('home-why-choose-subtitle', 'Experience the difference with our modern approach to mobile care.');

  return (
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
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Genuine Parts</h3>
            <p className="text-sm text-gray-600">Quality spares sourced from trusted vendors</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🛡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
            <p className="text-sm text-gray-600">Your data and device protected at every step</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">🔧</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Warranty on Repairs</h3>
            <p className="text-sm text-gray-600">Up to 3-6 months on most repairs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick TAT</h3>
            <p className="text-sm text-gray-600">Pickup, repair and deliver — often same day</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomeLazy() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Mobizilla - Repair, Buy & Sell All Things Mobile</title>
        <meta name="description" content="AI-assisted diagnostics, genuine parts, and transparent pricing. Your trusted mobile experts." />
      </Helmet>

      <LazyHeroSection />
      
      {/* Mobile Categories / Brands / Models */}
      <DeviceBrowserSection />
      
      <LazyStatsSection />
      <LazyWhyChooseSection />
    </div>
  );
}