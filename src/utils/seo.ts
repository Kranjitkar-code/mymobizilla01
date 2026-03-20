import { MOBIZILLA } from '@/config/mobizilla';

export const SEO = {
  home: {
    title: MOBIZILLA.seo.defaultTitle,
    description: MOBIZILLA.seo.defaultDescription,
  },
  repair: {
    title: 'Phone Repair Kathmandu | Same Day Service — Mobizilla',
    description: 'Expert mobile and laptop repair at Ratna Plaza, New Road, Kathmandu. Same day service, genuine parts, 6-month warranty.',
  },
  buyback: {
    title: 'Sell Your Old Phone | Mobizilla Buyback Nepal',
    description: 'Get the best price for your used phone in Nepal. Instant quote, same-day payment via eSewa or Khalti.',
  },
  training: {
    title: 'Mobizilla Academy — Mobile Repair Training in Nepal',
    description: 'Learn mobile phone repair from experts at Mobizilla Academy, Kathmandu. Certified courses from beginner to chip-level.',
  },
  store: {
    title: 'Mobile Accessories & Parts | Mobizilla Nepal Store',
    description: 'Buy genuine mobile parts, accessories, and tools at Mobizilla Store. Free delivery in Kathmandu Valley.',
  },
  contact: {
    title: 'Contact Mobizilla Nepal | New Road, Kathmandu',
    description: `Visit us at ${MOBIZILLA.contact.address}. Call ${MOBIZILLA.contact.phone1}. Open ${MOBIZILLA.contact.hours}.`,
  },
  blog: {
    title: 'Mobizilla Blog — Mobile Repair Tips & News | Nepal',
    description: 'Expert tips on mobile repair, phone care, and technology news from Mobizilla Nepal.',
  },
} as const;

export function getJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: MOBIZILLA.brand.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ratna Plaza, New Road',
      addressLocality: MOBIZILLA.contact.city,
      addressRegion: 'Bagmati Province',
      postalCode: '44600',
      addressCountry: 'NP',
    },
    telephone: MOBIZILLA.contact.phone1,
    url: MOBIZILLA.brand.website,
    openingHours: 'Su-Fr 10:00-19:00',
    priceRange: MOBIZILLA.currency.symbol,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: MOBIZILLA.contact.lat,
      longitude: MOBIZILLA.contact.lng,
    },
    sameAs: [
      MOBIZILLA.social.facebook,
      MOBIZILLA.social.instagram,
      MOBIZILLA.social.youtube,
      MOBIZILLA.social.tiktok,
    ],
    description: MOBIZILLA.seo.defaultDescription,
  };
}
