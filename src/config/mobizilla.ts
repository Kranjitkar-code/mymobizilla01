export const MOBIZILLA = {
  brand: {
    name: 'Mobizilla',
    fullName: 'Mobizilla Technology Pvt. Ltd.',
    tagline: 'Recycle. Repair. Update.',
    website: 'https://mymobizilla.com',
    email: 'info@mymobizilla.com',
    logo: '/assets/mobizilla-logo.svg',
    favicon: '/assets/favicon.ico',
  },

  contact: {
    phone1: '+977-1-5354999',
    phone2: '+977-9801018203',
    whatsapp: '+9779801018203',
    email: 'info@mymobizilla.com',
    address: 'Ratna Plaza, New Road, Kathmandu 44600, Nepal',
    city: 'Kathmandu',
    country: 'Nepal',
    hours: '10:00 AM – 7:00 PM, Sunday–Friday',
    maps: 'https://maps.google.com/?q=Ratna+Plaza+New+Road+Kathmandu',
    lat: 27.7041,
    lng: 85.3131,
  },

  currency: {
    code: 'NPR',
    symbol: '₨',
    locale: 'ne-NP',
    position: 'prefix' as const,
  },

  tax: {
    percent: 13,
    label: 'VAT',
    inclusive: true,
  },

  phone: {
    countryCode: '+977',
    twilioPrefix: '977',
    minDigits: 9,
    maxDigits: 10,
    mobileRegex: /^(\+977|977|0)?[9][6-9]\d{8}$/,
    landlineRegex: /^(\+977|977)?0[1-9]\d{6,7}$/,
  },

  payments: {
    providers: ['esewa', 'khalti', 'connectips', 'fonepay'] as const,
    labels: {
      esewa: 'eSewa',
      khalti: 'Khalti',
      connectips: 'ConnectIPS',
      fonepay: 'FonePay',
    } as Record<string, string>,
    logos: {
      esewa: '/assets/payments/esewa.png',
      khalti: '/assets/payments/khalti.png',
      connectips: '/assets/payments/connectips.png',
      fonepay: '/assets/payments/fonepay.png',
    } as Record<string, string>,
  },

  shipping: {
    zones: [
      { name: 'Kathmandu Valley', fee: 0, label: 'Free Delivery' },
      { name: 'Outside Valley', fee: 200, label: 'NPR 200' },
      { name: 'International', fee: 1500, label: 'NPR 1,500' },
    ],
    defaultFee: 200,
  },

  tracking: {
    prefix: 'SNP',
    digits: 6,
  },

  ecosystem: {
    repair: 'Mobizilla Repair Lab',
    academy: 'Mobizilla Academy',
    erp: 'Mobisoft',
    ecommerce: 'Mobizilla Store',
    buyback: 'Mobizilla Buyback',
  },

  seo: {
    defaultTitle: 'Mobizilla — Mobile Repair, Buyback & Academy | Kathmandu, Nepal',
    defaultDescription: "Nepal's trusted mobile repair center. Expert phone repair, buyback, refurbishment & training at Ratna Plaza, New Road, Kathmandu.",
    keywords: [
      'mobile repair Kathmandu',
      'phone repair Nepal',
      'screen replacement Nepal',
      'buyback phone Nepal',
      'mobile repair New Road',
      'Mobizilla',
      'mymobizilla',
    ],
    ogImage: '/assets/og-mobizilla.jpg',
  },

  social: {
    facebook: 'https://facebook.com/mymobizilla',
    instagram: 'https://instagram.com/mymobizilla',
    youtube: 'https://youtube.com/@mymobizilla',
    tiktok: 'https://tiktok.com/@mymobizilla',
  },
} as const;

// ─── Currency Utilities ───────────────────────────────────────
export function formatNPR(amount: number): string {
  return `${MOBIZILLA.currency.symbol}${amount.toLocaleString('ne-NP')}`;
}

export function vatAmount(amount: number): number {
  return Math.round(amount * (MOBIZILLA.tax.percent / 100));
}

export function calcOrderTotals(subtotal: number, shippingFee = 0) {
  const vat = vatAmount(subtotal);
  return { subtotal, vat, shipping: shippingFee, total: subtotal + vat + shippingFee };
}

// ─── Phone Utilities ──────────────────────────────────────────
export function validateNepalPhone(phone: string): boolean {
  const c = phone.replace(/[\s\-\(\)]/g, '');
  return MOBIZILLA.phone.mobileRegex.test(c) || MOBIZILLA.phone.landlineRegex.test(c);
}

export function formatForTwilio(phone: string): string {
  const c = phone.replace(/[\s\-\(\)\+]/g, '');
  if (c.startsWith('977')) return c;
  if (c.startsWith('0')) return `977${c.slice(1)}`;
  return `977${c}`;
}
