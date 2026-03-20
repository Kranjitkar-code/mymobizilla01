import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wrench, Clock, ArrowRight } from 'lucide-react';
import type { WPService } from '@/lib/wordpress';

interface ServicesGridProps {
  services: WPService[];
  loading?: boolean;
  error?: string | null;
}

function ServicesGrid({ services = [], loading = false, error = null }: ServicesGridProps) {

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-full flex flex-col">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Failed to load services. Please try again later.'}</p>
      </div>
    );
  }

  if (!loading && (!services || services.length === 0)) {
    return (
      <div className="text-center py-12">
        <p>No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
          {service._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={service._embedded['wp:featuredmedia'][0].source_url}
                alt={service._embedded['wp:featuredmedia'][0].alt_text || service.title.rendered}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Wrench className="h-16 w-16 text-gray-300" />
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="text-xl">
              <div dangerouslySetInnerHTML={{ __html: service.title.rendered }} />
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              {service.acf?.price && (
                <span className="font-semibold text-primary">
                  ${service.acf.price}
                </span>
              )}
              {service.acf?.duration && (
                <span className="flex items-center ml-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.acf.duration}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <CardDescription className="line-clamp-3">
              <div dangerouslySetInnerHTML={{ __html: service.excerpt.rendered }} />
            </CardDescription>
          </CardContent>
          
          <CardFooter>
            <Button variant="outline" className="w-full group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { ServicesGrid };
export default ServicesGrid;
