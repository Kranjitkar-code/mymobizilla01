import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import { useContentItem } from '@/contexts/ContentContext';
import { MOBIZILLA } from '@/config/mobizilla';

export default function Footer() {
  const contactAddress = useContentItem('contact-address', MOBIZILLA.contact.address);
  const contactEmail = useContentItem('contact-email', MOBIZILLA.contact.email);
  const contactPhone = useContentItem('contact-phone', MOBIZILLA.contact.phone1);
  const footerDescription = useContentItem('footer-description', 'Your trusted partner for all mobile device needs. Expert repairs, fair buyback prices, and quality service in Nepal.');

  return (
    <footer className="border-t mt-16 bg-gradient-to-t from-[#e8ecf3] to-transparent">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="min-w-0 overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <Logo variant="full" size="md" showTagline={true} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed break-words">{footerDescription}</p>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold mb-2 text-primary">Quick Links</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/buyback" className="hover:text-primary">Buyback</Link></li>
            <li><Link to="/repair" className="hover:text-primary">Repair</Link></li>
            <li><Link to="/training" className="hover:text-primary">Training</Link></li>
          </ul>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold mb-2 text-primary">Contact Us</h4>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p className="text-foreground font-semibold">{MOBIZILLA.brand.fullName}</p>
            <p>{contactAddress}</p>
            <p>📞 {contactPhone} | 📱 {MOBIZILLA.contact.phone2}</p>
            <p>✉️ {contactEmail}</p>
            <p>🕐 {MOBIZILLA.contact.hours}</p>
            <a href={MOBIZILLA.brand.website} className="hover:text-primary underline">mymobizilla.com</a>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Payments:</strong>{' '}
            {MOBIZILLA.payments.providers.map((p) => MOBIZILLA.payments.labels[p]).join(' | ')}
          </div>

          <div className="mt-4">
            <h5 className="font-medium mb-2 text-primary">Follow Us</h5>
            <div className="flex items-center gap-4">
              <a
                href={MOBIZILLA.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Follow us on Instagram"
              >
                <img src="/images/instagram.avif" alt="Instagram" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </a>
              <a
                href={MOBIZILLA.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Follow us on Facebook"
              >
                <img src="/images/facebook.webp" alt="Facebook" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </a>
              <a
                href={`https://wa.me/${MOBIZILLA.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Contact us on WhatsApp"
              >
                <img src="/images/whatsapp.webp" alt="WhatsApp" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </a>
              <a
                href={MOBIZILLA.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity flex items-center"
                aria-label="Subscribe to our YouTube channel"
              >
                <img src="/images/youtube.png" alt="YouTube" className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {MOBIZILLA.brand.name}. All rights reserved. {MOBIZILLA.brand.tagline}
      </div>
    </footer>
  );
}
