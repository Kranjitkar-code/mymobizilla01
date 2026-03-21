import { useState, useEffect } from 'react';
import SupabasePhonesService, { type PhoneModelRow } from '@/services/supabasePhonesService';
import SupabaseBrandsService, { type BrandRow } from '@/services/supabaseBrandsService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

type ViewState = 'brands' | 'categories' | 'models';

export interface DeviceBrowserSectionProps {
  defaultServiceType?: 'repair' | 'buyback' | null;
}

const FALLBACK_BRANDS: BrandRow[] = [
  { id: 'fb-apple', name: 'Apple', logo_url: '/images/Apple/Apple.webp' },
  { id: 'fb-samsung', name: 'Samsung', logo_url: '/images/Samsung/Samsung.webp' },
  { id: 'fb-xiaomi', name: 'Xiaomi', logo_url: '/images/Xiaomi/Xiaomi.webp' },
  { id: 'fb-oneplus', name: 'OnePlus', logo_url: '/images/OnePlus/OnePlus.webp' },
  { id: 'fb-vivo', name: 'VIVO', logo_url: '/images/VIVO/vivo.webp' },
  { id: 'fb-oppo', name: 'OPPO', logo_url: '/images/OPPO/oppo.webp' },
  { id: 'fb-realme', name: 'Realme', logo_url: '/images/Realme/realme.webp' },
  { id: 'fb-motorolla', name: 'Motorolla', logo_url: '/images/Motorolla/motorolla.webp' },
  { id: 'fb-google', name: 'Google', logo_url: '/images/Google/Google.webp' },
  { id: 'fb-nothing', name: 'Nothing', logo_url: '/images/Nothing/NOTHING.webp' },
  { id: 'fb-iqoo', name: 'IQOO', logo_url: '/images/IQOO/iqoo.webp' },
  { id: 'fb-poco', name: 'POCO', logo_url: '/images/POCO/poco.webp' },
  { id: 'fb-huawei', name: 'Huawei', logo_url: '/images/Huawei/huawei.webp' },
  { id: 'fb-asus', name: 'ASUS', logo_url: '/images/ASUS/asus.webp' },
  { id: 'fb-lg', name: 'LG', logo_url: '/images/LG/LG.webp' },
];

function fb(brand: string, model: string, series?: string): PhoneModelRow {
  const folder = series ? `${brand}/${series}` : brand;
  return { id: `fb-${brand}-${model}`, brand, model, series: series || null, image_url: `/images/${folder}/${model}.webp`, base_price: null };
}

const FALLBACK_MODELS: Record<string, PhoneModelRow[]> = {
  Apple: [
    'Iphone 16 Pro Max', 'Iphone 16 Pro', 'Iphone 16 Plus', 'Iphone 16', 'Iphone 16e',
    'Iphone 15 Pro Max', 'Iphone 15 Pro', 'Iphone 15 Plus', 'Iphone 15',
    'Iphone 14 pro max', 'Iphone 14 pro', 'Iphone 14 plus', 'Iphone 14',
    'Iphone 13 Pro Max', 'Iphone 13 pro', 'Iphone 13 mini', 'Iphone 13',
    'Iphone 12 pro max', 'Iphone 12 pro', 'Iphone 12 mini', 'Iphone 12',
    'Iphone 11 pro max', 'Iphone 11 pro', 'Iphone 11',
    'Iphone XS Max', 'Iphone XS', 'Iphone XR', 'Iphone X',
    'Iphone 8 plus', 'iPhone 8', 'Iphone 7 plus', 'Iphone 7',
    'Iphone 6s plus', 'Iphone 6s', 'Iphone 6 plus', 'Iphone 6',
    'Iphone se 2020', 'Iphone se',
  ].map(m => fb('Apple', m)),

  Samsung: [
    ...['Galaxy s24 Ultra', 'Galaxy S24 plus', 'Galaxy S24', 'Galaxy s23 Ultra', 'Galaxy S23 plus', 'Galaxy S23', 'Galaxy S22 Ultra 5g', 'Galaxy S22 Plus 5g', 'Galaxy S22 5G', 'Galaxy s21 fe 5g', 'Galaxy S21 Ultra 5G', 'Galaxy s21 plus 5g', 'Galaxy s21 5g', 'Galaxy s20 fe 5g', 'Galaxy s20 ultra 5g', 'Galaxy S20 Plus', 'Galaxy s20', 'Galaxy s10 plus', 'Galaxy s10', 'Galaxy s9 plus', 'Galaxy s9'].map(m => fb('Samsung', m, 'Series S')),
    ...['Galaxy A54 5g', 'Galaxy A53 5g', 'Galaxy A52 5g', 'Galaxy A51', 'Galaxy A34 5g', 'Galaxy A33 5g', 'Galaxy A23', 'Galaxy A22', 'Galaxy A15 5g', 'Galaxy A14', 'Galaxy A13', 'Galaxy A12', 'Galaxy A04', 'Galaxy A03', 'Galaxy A02'].map(m => fb('Samsung', m, 'Series A')),
    ...['Galaxy M54 5G', 'Galaxy M53 5G', 'Galaxy M34 5G', 'Galaxy M33 5G', 'Galaxy M32 4G', 'Galaxy M31', 'Galaxy M21', 'Galaxy M12'].map(m => fb('Samsung', m, 'Series M')),
    ...['Galaxy note 20 ultra 5g', 'Galaxy note 20 5G', 'Galaxy Note 10 plus', 'Galaxy note 10', 'Galaxy Note 9', 'Galaxy note 8'].map(m => fb('Samsung', m, 'Series Note')),
    ...['Galaxy F54', 'Galaxy F41 5G', 'Galaxy f23 5g', 'Galaxy F12', 'Galaxy F04'].map(m => fb('Samsung', m, 'Series F')),
    ...['Galaxy J8', 'Galaxy J7 Pro', 'Galaxy J7 Prime', 'Galaxy J7', 'Galaxy J6 Plus', 'Galaxy J6'].map(m => fb('Samsung', m, 'Series J')),
    ...['Galaxy Z fold 4', 'Galaxy Z fold 3 5g', 'Galaxy Z flip 4 5g', 'Galaxy Z flip 3 5g'].map(m => fb('Samsung', m, 'Series Z')),
  ],

  Xiaomi: [
    ...['mi 11 ultra', 'mi 11 lite', 'MI 11 pro 5g', 'mi 11 5g', 'mi 10 pro', 'mi 10', 'mi a1', 'MI A3'].map(m => fb('Xiaomi', m, 'Series MI')),
    ...['redmi note 12 pro plus 5g', 'redmi note 12 pro 5g', 'redmi note 12 5g', 'redmi note 11 pro plus 5g', 'redmi note 11 pro', 'redmi note 10 pro max', 'redmi note 10 pro', 'redmi note 10', 'redmi note 9 pro max', 'redmi note 9 pro', 'redmi note 9', 'redmi note 8 pro', 'redmi note 8', 'redmi note 7 pro', 'redmi note 7'].map(m => fb('Xiaomi', m, 'Series Note')),
    ...['redmi 12 5g', 'redmi 10 prime', 'redmi 10', 'redmi 9 prime', 'redmi 9', 'redmi 8a', 'redmi 8', 'redmi 7a', 'redmi 7', 'redmi 6 pro', 'redmi 6'].map(m => fb('Xiaomi', m, 'Series Redmi')),
    ...['Redmi K20', 'Redmi y2', 'Redmi Y3'].map(m => fb('Xiaomi', m, 'Series X')),
  ],

  OnePlus: [
    'Oneplus 12 5g', 'Oneplus 12R 5g', 'Oneplus 11 5g', 'Oneplus 11R 5g',
    'Oneplus 10 pro 5g', 'Oneplus 10T 5g', 'Oneplus 10R 5g',
    'Oneplus 9 pro 5g', 'Oneplus 9 5g', 'Oneplus 9r 5g',
    'Oneplus 8T', 'Oneplus 8 pro', 'Oneplus 8',
    'Oneplus 7T pro', 'Oneplus 7T', 'Oneplus 7 pro', 'Oneplus 7',
    'Oneplus 6T', 'Oneplus 6',
    'Oneplus nord 3 5g', 'Oneplus nord 2T 5g', 'Oneplus nord 2 5g', 'Oneplus nord',
    'Oneplus nord CE3 5g', 'Oneplus nord ce2 5g', 'Oneplus nord ce 5g',
  ].map(m => fb('OnePlus', m)),

  VIVO: [
    ...['y100', 'y75 5g', 'y73', 'y56 5g', 'y35', 'y33 t', 'y27 5g', 'y22', 'y21', 'y20', 'y16', 'y15', 'y12', 'y11'].map(m => fb('VIVO', m, 'series y')),
    ...['v29 pro', 'v29', 'v27 pro', 'v27', 'v25 pro', 'v25', 'v23 pro', 'v23 5g', 'v21', 'v20 pro', 'v20', 'v19', 'v17 pro', 'v15 pro', 'v15'].map(m => fb('VIVO', m, 'series v')),
    ...['x80 pro', 'x80', 'x70 pro plus', 'x70 pro', 'x60 pro', 'x60', 'x50 pro', 'x50'].map(m => fb('VIVO', m, 'series x')),
    ...['t2x 5g', 't2 5g', 't1 pro 5g', 't1 5g', 't1 x', 't1'].map(m => fb('VIVO', m, 'series t')),
  ],

  OPPO: [
    ...['a78 5g', 'a77', 'a76', 'a74 5g', 'a58', 'a57 4g', 'a55', 'a54', 'a53 5g', 'a53', 'a52', 'a36', 'a35', 'a16', 'a15', 'a12', 'a5 2020', 'a3 s'].map(m => fb('OPPO', m, 'series a')),
    ...['f21 s pro 5g', 'f19 pro plus 5g', 'f19 pro', 'f19', 'f15'].map(m => fb('OPPO', m, 'series f')),
    ...['reno 10 pro plus 5g', 'reno 10 5g', 'reno 8 5g', 'reno 7 5g', 'reno 6 5g', 'reno 5 pro 5g'].map(m => fb('OPPO', m, 'series reno')),
  ],

  Realme: [
    'realme 13 pro plus 5g', 'realme 13 pro', 'realme 12 pro plus 5g', 'realme 12 pro',
    'realme 11 pro plus 5g', 'realme 11 pro', 'realme 9 pro plus 5g', 'realme 9',
    'realme 8 pro', 'realme 7 pro', 'realme 7', 'realme 6 pro', 'realme 6',
    'realme gt2 pro', 'realme gt master edition',
    'realme narzo 50 pro', 'realme narzo 50', 'realme narzo 30 pro 5g', 'realme narzo 30',
    'realme c67 5g',
  ].map(m => fb('Realme', m)),

  Motorolla: [
    ...['g 84', 'g 82 5g', 'g 72', 'g 62 5g', 'g 54 5g', 'g 52', 'g 34 5g', 'g 32', 'g 31'].map(m => fb('Motorolla', m, 'series g')),
    ...['Motorolla E 40', 'E 30', 'E 13'].map(m => fb('Motorolla', m, 'series e')),
    ...['edge 50 pro', 'edge 50 fusion', 'edge 40 neo', 'edge 40', 'edge 30', 'edge 20'].map(m => fb('Motorolla', m, 'series x')),
  ],

  Google: [
    'pixel 9 pro xl', 'pixel 9 pro fold', 'pixel 9 pro', 'pixel 9',
    'pixel 8a', 'pixel 8 pro', 'pixel 8', 'pixel 7a', 'pixel 7 pro', 'pixel 7',
    'pixel 6 pro', 'pixel 6', 'pixel 5', 'pixel 4a 5g', 'pixel 4a 4g',
    'pixel 4 xl', 'pixel 4', 'pixel 3a xl', 'pixel 3a',
  ].map(m => fb('Google', m)),

  Nothing: [
    'phone 2', 'nothing phone 2a', 'nothing phone 1', 'cmf phone 2 pro', 'cmf phone',
  ].map(m => fb('Nothing', m)),

  IQOO: [
    '11 5g', '9 se 5g', '9 5g', 'neo 6 5g', 'Z7s 5g', 'Z6 lite 5g', 'Z3', '7',
  ].map(m => fb('IQOO', m)),

  POCO: [
    'poco x4 pro 5g', 'poco x3 pro', 'poco x2', 'poco m4 pro 4g', 'poco m3 pro 5g', 'poco f1',
  ].map(m => fb('POCO', m)),

  Huawei: [
    'p30 pro', 'honor 9 lite', 'honor 8x', 'honor 7c',
  ].map(m => fb('Huawei', m)),

  ASUS: [
    'ROG phone 3', 'ROG phone 2', 'zenphon max pro m2',
  ].map(m => fb('ASUS', m)),

  LG: [
    'wing 5g', 'G8 thinq',
  ].map(m => fb('LG', m)),
};

export default function DeviceBrowserSection({ defaultServiceType = null }: DeviceBrowserSectionProps) {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>('brands');

  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [selectedBrand, setSelectedBrand] = useState<BrandRow | null>(null);

  const [models, setModels] = useState<PhoneModelRow[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setBrandsLoading(true);
      try {
        const data = await SupabaseBrandsService.getAllBrands();
        setBrands(data.length > 0 ? data : FALLBACK_BRANDS);
      } catch {
        setBrands(FALLBACK_BRANDS);
      } finally {
        setBrandsLoading(false);
      }
    })();
  }, []);

  const handleBrandClick = async (brand: BrandRow) => {
    setSelectedBrand(brand);
    setModelsLoading(true);
    setSelectedSeries(null);
    setSeriesList([]);

    try {
      const data = await SupabasePhonesService.getModelsByBrand(brand.name);
      const resolved = data.length > 0 ? data : (FALLBACK_MODELS[brand.name] || []);
      setModels(resolved);
      deriveSeriesAndNavigate(resolved);
    } catch {
      const fallback = FALLBACK_MODELS[brand.name] || [];
      setModels(fallback);
      deriveSeriesAndNavigate(fallback);
    } finally {
      setModelsLoading(false);
    }
  };

  const deriveSeriesAndNavigate = (data: PhoneModelRow[]) => {
    const uniqueSeries = new Set<string>();
    for (const m of data) {
      if (m.series && m.series.trim()) uniqueSeries.add(m.series.trim());
    }
    const sorted = Array.from(uniqueSeries).sort();
    setSeriesList(sorted);
    setViewState(sorted.length > 1 ? 'categories' : 'models');
  };

  const handleSeriesClick = (s: string) => {
    setSelectedSeries(s);
    setViewState('models');
  };

  const handleBackClick = () => {
    if (viewState === 'models' && seriesList.length > 1 && selectedSeries) {
      setViewState('categories');
      setSelectedSeries(null);
    } else {
      setViewState('brands');
      setSelectedBrand(null);
      setModels([]);
      setSeriesList([]);
      setSelectedSeries(null);
    }
  };

  const getDisplayModels = (): PhoneModelRow[] => {
    let filtered = models;
    if (selectedSeries) {
      filtered = models.filter(m => (m.series || '').trim().toLowerCase() === selectedSeries.toLowerCase());
    }
    return [...filtered].sort((a, b) => a.model.localeCompare(b.model, undefined, { sensitivity: 'base' }));
  };

  const handleModelClick = (entry: PhoneModelRow) => {
    const deviceInfo = {
      brand: selectedBrand?.name || '',
      model: formatModelName(entry.model),
      category: selectedSeries || ''
    };

    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem('navIntent');
      sessionStorage.removeItem('navIntent');
    } catch {
      /* ignore */
    }

    let serviceType: 'repair' | 'buyback' = 'repair';
    if (raw === 'buyback') {
      serviceType = 'buyback';
    } else if (raw === 'repair') {
      serviceType = 'repair';
    } else if (defaultServiceType === 'buyback') {
      serviceType = 'buyback';
    } else if (defaultServiceType === 'repair') {
      serviceType = 'repair';
    }

    sessionStorage.setItem('selectedDevice', JSON.stringify(deviceInfo));
    sessionStorage.setItem('serviceType', serviceType);
    navigate(`/${serviceType}`, { state: { selectedDevice: deviceInfo, serviceType } });
  };

  const formatModelName = (model: string) => {
    return model
      .replace(/\.(webp|jpg|png)$/i, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <section id="browse-by-brand" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {viewState === 'brands' && 'Browse by Brand'}
            {viewState === 'categories' && `${selectedBrand?.name} Series`}
            {viewState === 'models' && (selectedSeries ? `${selectedBrand?.name} — ${selectedSeries}` : `${selectedBrand?.name} Models`)}
          </h2>
          {viewState !== 'brands' && (
            <button
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>

        {/* Brands Grid */}
        {viewState === 'brands' && (
          brandsLoading ? (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-4 w-24 sm:w-28 md:w-32">
                  <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-lg" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandClick(brand)}
                  className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-200 group w-24 sm:w-28 md:w-32 flex-shrink-0"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={brand.logo_url || '/placeholder.svg'}
                      alt={brand.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center">{brand.name}</span>
                </button>
              ))}
            </div>
          )
        )}

        {/* Series / Categories Grid */}
        {viewState === 'categories' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {seriesList.map((s) => (
              <button
                key={s}
                onClick={() => handleSeriesClick(s)}
                className="p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{s}</h3>
                <p className="text-sm text-gray-500">View Models →</p>
              </button>
            ))}
            <button
              onClick={() => { setSelectedSeries(null); setViewState('models'); }}
              className="p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-500"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">All Models</h3>
              <p className="text-sm text-gray-500">View All →</p>
            </button>
          </div>
        )}

        {/* Models Grid */}
        {viewState === 'models' && (
          modelsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-3">
                  <Skeleton className="w-full aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : getDisplayModels().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No models found for {selectedBrand?.name}</p>
              <p className="text-gray-400 text-sm mt-2">Models can be added via the admin panel</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {getDisplayModels().map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleModelClick(entry)}
                  className="flex flex-col items-center gap-3 p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-200 group cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={entry.image_url || '/placeholder.svg'}
                      alt={entry.model}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center line-clamp-2">
                    {formatModelName(entry.model)}
                  </span>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
