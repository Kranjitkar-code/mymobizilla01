import { useState, useEffect } from 'react';
import SupabasePhonesService, { type PhoneModelRow } from '@/services/supabasePhonesService';
import SupabaseBrandsService, { type BrandRow } from '@/services/supabaseBrandsService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

type ViewState = 'brands' | 'categories' | 'models';

export interface DeviceBrowserSectionProps {
  defaultServiceType?: 'repair' | 'buyback' | null;
}

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
        setBrands(data);
      } catch {
        setBrands([]);
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
      setModels(data);
      deriveSeriesAndNavigate(data);
    } catch {
      setModels([]);
      deriveSeriesAndNavigate([]);
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
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No brands available yet</p>
              <p className="text-gray-400 text-sm mt-2">Brands can be added via the admin panel</p>
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
