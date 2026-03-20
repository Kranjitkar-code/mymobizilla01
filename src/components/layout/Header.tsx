import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useContentItem } from "@/contexts/ContentContext";
import { MOBIZILLA } from "@/config/mobizilla";

const nav = [
  { to: "/", label: "Home" },
  { to: "/repair", label: "Repair", scrollTo: "browse-by-brand" },
  { to: "/buyback", label: "Buy Back", scrollTo: "browse-by-brand" },
  { to: "/training", label: "Training" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(30);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const contactPhone = useContentItem('contact-phone', MOBIZILLA.contact.phone1);

  const handleNavClick = (item: typeof nav[0], e: React.MouseEvent) => {
    if (item.scrollTo) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/?scrollTo=" + item.scrollTo);
      } else {
        const element = document.getElementById(item.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMx(x);
      setMy(y);
      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
          <Logo variant="minimal" size="xl" showTagline={false} />
        </Link>

        <nav className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={(e) => handleNavClick(item, e)}
              className={`text-sm px-2.5 lg:px-3 py-2 rounded transition-colors duration-150 whitespace-nowrap ${isActive(item.to)
                ? "bg-primary text-white shadow"
                : "hover:bg-primary/10 text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${contactPhone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            aria-label="Call Mobizilla"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">{contactPhone}</span>
          </a>

          <Link to="/admin/login">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">Admin</Button>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <a
            href={`tel:${MOBIZILLA.contact.phone1.replace(/[\s\-]/g, '')}`}
            className="flex items-center text-primary hover:text-primary/80 transition-colors p-2"
            aria-label="Call Mobizilla"
          >
            <Phone className="h-5 w-5" />
          </a>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="pb-4 border-b">
                  <Logo variant="full" size="lg" showTagline={true} />
                </div>

                <div className="pb-3 border-b">
                  <Link
                    to="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Admin Login</span>
                  </Link>
                </div>

                <nav className="flex flex-col space-y-1">
                  {nav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(e) => {
                        handleNavClick(item, e);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${isActive(item.to)
                        ? "bg-primary text-white shadow"
                        : "hover:bg-primary/10 text-muted-foreground"
                        }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="pt-3 border-t">
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{contactPhone}</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none h-0" style={{ background: "var(--gradient-hero)" }} />
    </header>
  );
}
