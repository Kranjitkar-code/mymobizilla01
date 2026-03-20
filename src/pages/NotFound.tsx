import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MOBIZILLA } from "@/config/mobizilla";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-3">
          <Link to="/">
            <Button size="lg" className="w-full">Return to Home</Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            <p>Need help? Contact {MOBIZILLA.brand.name}:</p>
            <p className="mt-1">
              <a href={`tel:${MOBIZILLA.contact.phone1.replace(/[\s\-]/g, '')}`} className="text-primary font-medium">
                {MOBIZILLA.contact.phone1}
              </a>
              {' '} | {' '}
              <a href={`mailto:${MOBIZILLA.contact.email}`} className="text-primary font-medium">
                {MOBIZILLA.contact.email}
              </a>
            </p>
            <p className="mt-1">
              <a href={MOBIZILLA.brand.website} className="text-primary underline">mymobizilla.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
