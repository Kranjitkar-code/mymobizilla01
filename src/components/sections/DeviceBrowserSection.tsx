import { useState, useEffect } from 'react';
import SupabasePhonesService from '@/services/supabasePhonesService';
import SupabaseBrandsService from '@/services/supabaseBrandsService';
import { useNavigate } from 'react-router-dom';

// Brand configuration with series info
const BRANDS = [
  {
    name: 'Apple',
    logo: '/images/Apple/Apple.webp',
    hasCategories: false,
    models: [
      'Iphone 16 Pro Max', 'Iphone 16 Pro', 'Iphone 16 Plus', 'Iphone 16', 'Iphone 16e',
      'Iphone 15 Pro Max', 'Iphone 15 Pro', 'Iphone 15 Plus', 'Iphone 15',
      'Iphone 14 pro max', 'Iphone 14 pro', 'Iphone 14 plus', 'Iphone 14',
      'Iphone 13 Pro Max', 'Iphone 13 pro', 'Iphone 13 mini', 'Iphone 13',
      'Iphone 12 pro max', 'Iphone 12 pro', 'Iphone 12 mini', 'Iphone 12',
      'Iphone 11 pro max', 'Iphone 11 pro', 'Iphone 11',
      'Iphone XS Max', 'Iphone XS', 'Iphone XR', 'Iphone X',
      'Iphone 8 plus', 'iPhone 8', 'Iphone 7 plus', 'Iphone 7',
      'Iphone 6s plus', 'Iphone 6s', 'Iphone 6 plus', 'Iphone 6',
      'Iphone 5s', 'Iphone se 2020', 'Iphone se', 'Others'
    ]
  },
  {
    name: 'Samsung',
    logo: '/images/Samsung/Samsung.webp',
    hasCategories: true,
    categories: [
      { name: 'Series S', folder: 'Series S' },
      { name: 'Series A', folder: 'Series A' },
      { name: 'Series M', folder: 'Series M' },
      { name: 'Series Note', folder: 'Series Note' },
      { name: 'Series F', folder: 'Series F' },
      { name: 'Series J', folder: 'Series J' },
      { name: 'Series Z', folder: 'Series Z' },
      { name: 'Series ON', folder: 'Series ON' }
    ]
  },
  {
    name: 'Xiaomi',
    logo: '/images/Xiaomi/Xiaomi.webp',
    hasCategories: true,
    categories: [
      { name: 'MI Series', folder: 'Series MI' },
      { name: 'Redmi Note Series', folder: 'Series Note' },
      { name: 'Redmi Series', folder: 'Series Redmi' },
      { name: 'K & X Series', folder: 'Series X' },
      { name: 'A Series', folder: 'Series A' },
      { name: 'K Series', folder: 'Series K' }
    ]
  },
  {
    name: 'OnePlus',
    logo: '/images/OnePlus/OnePlus.webp',
    hasCategories: false,
    models: [
      'Oneplus 12R 5g', 'Oneplus 12 5g', 'Oneplus 11R 5g', 'Oneplus 11 5g',
      'Oneplus 10T 5g', 'Oneplus 10R 5g', 'Oneplus 10 pro 5g',
      'Oneplus 9RT 5g', 'Oneplus 9r 5g', 'Oneplus 9 pro 5g', 'Oneplus 9 5g',
      'Oneplus 8T', 'Oneplus 8 pro', 'Oneplus 8',
      'Oneplus 7T pro', 'Oneplus 7T', 'Oneplus 7 pro', 'Oneplus 7',
      'Oneplus 6T', 'Oneplus 6', 'Oneplus 5T', 'Oneplus 5', 'Oneplus 3T', 'Oneplus 3',
      'Oneplus nord CE3 Lite 5g', 'Oneplus nord CE3 5g', 'Oneplus nord ce2 lite 5g',
      'Oneplus nord ce2 5g', 'Oneplus nord ce 5g', 'Oneplus nord 3 5g', 'Oneplus nord 2T 5g',
      'Oneplus nord 2 5g', 'Oneplus nord', 'Others'
    ]
  },
  {
    name: 'VIVO',
    logo: '/images/VIVO/vivo.webp',
    hasCategories: true,
    categories: [
      { name: 'Y Series', folder: 'series y' },
      { name: 'V Series', folder: 'series v' },
      { name: 'X Series', folder: 'series x' },
      { name: 'T Series', folder: 'series t' },
      { name: 'S Series', folder: 'series s' },
      { name: 'U Series', folder: 'series u' },
      { name: 'Z Series', folder: 'series z' },
      { name: 'NEX Series', folder: 'series nex' }
    ]
  },
  {
    name: 'OPPO',
    logo: '/images/OPPO/oppo.webp',
    hasCategories: true,
    categories: [
      { name: 'A Series', folder: 'series a' },
      { name: 'F Series', folder: 'series f' },
      { name: 'Reno Series', folder: 'series reno' }
    ]
  },
  {
    name: 'Realme',
    logo: '/images/Realme/realme.webp',
    hasCategories: true,
    categories: [
      { name: 'X Series', folder: 'series x' }
    ],
    directModels: [
      'realme 13 pro plus 5g', 'realme 13 pro', 'realme 12 pro plus 5g', 'realme 12 pro',
      'realme 11 pro plus 5g', 'realme 11 pro', 'realme 9 pro plus 5g', 'realme 9',
      'realme 8 pro', 'realme 8 5g', 'realme 7 pro', 'realme 7', 'realme 6 pro', 'realme 6',
      'realme 5s', 'realme gt2 pro', 'realme gt master edition', 'realme c67 5g',
      'realme narzo n55', 'realme narzo 50i', 'realme narzo 50i prime', 'realme narzo 50a',
      'realme narzo 50a prime', 'realme narzo 50', 'realme narzo 50 pro', 'realme narzo 50 5g',
      'realme narzo 30a', 'realme narzo 30', 'realme narzo 30 pro 5g', 'realme narzo 30 5g',
      'realme narzo 20a', 'realme narzo 20', 'realme narzo 20 pro', 'realme narzo 10a',
      'realme narzo 10', 'realme note 11 pro 5g'
    ]
  },
  {
    name: 'Motorolla',
    logo: '/images/Motorolla/motorolla.webp',
    hasCategories: true,
    categories: [
      { name: 'G Series', folder: 'series g' },
      { name: 'E Series', folder: 'series e' },
      { name: 'X Series', folder: 'series x' }
    ]
  },
  {
    name: 'Google',
    logo: '/images/Google/Google.webp',
    hasCategories: false,
    models: [
      'pixel 9 pro xl', 'pixel 9 pro fold', 'pixel 9 pro', 'pixel 9',
      'pixel 8a', 'pixel 8 pro', 'pixel 8', 'pixel 7a', 'pixel 7 pro', 'pixel 7',
      'pixel 6 pro', 'pixel 6', 'pixel 5a 5g', 'pixel 5', 'pixel 4a 5g', 'pixel 4a 4g',
      'pixel 4 xl', 'pixel 4', 'pixel 3a xl', 'pixel 3a', 'pixel 3 xl', 'pixel 3',
      'pixel 2 xl', 'other'
    ]
  },
  {
    name: 'Nothing',
    logo: '/images/Nothing/NOTHING.webp',
    hasCategories: false,
    models: [
      'phone 2', 'nothing phone 2a', 'nothing phone 1', 'cmf phone 2 pro', 'cmf phone'
    ]
  },
  {
    name: 'IQOO',
    logo: '/images/IQOO/iqoo.webp',
    hasCategories: false,
    models: [
      '11 5g', '9 se 5g', '9 5g', 'neo 6 5g', 'Z7s 5g', 'Z6 lite 5g', 'Z3', '7'
    ]
  },
  {
    name: 'POCO',
    logo: '/images/POCO/poco.webp',
    hasCategories: true,
    categories: [
      { name: 'M Series', folder: 'series m' }
    ]
  },
  {
    name: 'Huawei',
    logo: '/images/Huawei/huawei.webp',
    hasCategories: false,
    models: [
      'p30 pro', 'honor 9 lite', 'honor 8x', 'honor 7c'
    ]
  },
  {
    name: 'ASUS',
    logo: '/images/ASUS/asus.webp',
    hasCategories: false,
    models: [
      'ROG phone 3', 'ROG phone 2', 'zenphon max pro m2'
    ]
  },
  {
    name: 'LG',
    logo: '/images/LG/LG.webp',
    hasCategories: false,
    models: [
      'wing 5g', 'G8 thinq'
    ]
  }
];

type ViewState = 'brands' | 'categories' | 'models';

export interface DeviceBrowserSectionProps {
  defaultServiceType?: 'repair' | 'buyback' | null;
}

interface BrandData {
  name: string;
  logo: string;
  hasCategories: boolean;
  categories?: Array<{ name: string; folder: string }>;
  models?: string[];
  directModels?: string[];
}

export default function DeviceBrowserSection({ defaultServiceType = null }: DeviceBrowserSectionProps) {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>('brands');
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; folder: string } | null>(null);
  const [categoryModels, setCategoryModels] = useState<string[]>([]);
  const [customModels, setCustomModels] = useState<Array<{ id: string; brand: string; series?: string | null; model: string; image_url?: string | null }>>([]);
  const [dynamicBrands, setDynamicBrands] = useState<BrandData[]>([]);

  // Load Brands from Supabase
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await SupabaseBrandsService.getAllBrands();
        const formatted: BrandData[] = brandsData.map(b => ({
          name: b.name,
          logo: b.logo_url || '/placeholder.svg',
          hasCategories: false,
          models: []
        }));
        setDynamicBrands(formatted);
      } catch (e) {
        console.error("Failed to load dynamic brands", e);
      }
    };
    loadBrands();
  }, []);

  // Merge hardcoded and dynamic brands
  // We filter out dynamic brands that already exist in hardcoded list to avoid duplicates
  const displayedBrands = [
    ...BRANDS,
    ...dynamicBrands.filter(db => !BRANDS.some(hb => hb.name.toLowerCase() === db.name.toLowerCase()))
  ];

  // Load custom models from Supabase for selected brand and prepend them
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedBrand) {
        setCustomModels([]);
        return;
      }

      try {
        const rows = await SupabasePhonesService.getModelsByBrand(selectedBrand.name);
        if (mounted) setCustomModels(rows || []);
      } catch (err) {
        console.error('Error loading custom phone models:', err);
        if (mounted) setCustomModels([]);
      }
    })();

    return () => { mounted = false; };
  }, [selectedBrand]);

  const handleBrandClick = (brand: BrandData) => {
    setSelectedBrand(brand);
    if (brand.hasCategories && brand.categories) {
      setViewState('categories');
    } else {
      setViewState('models');
    }
  };

  const handleCategoryClick = async (category: { name: string; folder: string }) => {
    setSelectedCategory(category);

    // Dynamically import models from the category folder
    const models = await getModelsFromFolder(selectedBrand!.name, category.folder);
    setCategoryModels(models);
    setViewState('models');
  };

  const handleBackClick = () => {
    if (viewState === 'models' && selectedBrand?.hasCategories && selectedCategory) {
      setViewState('categories');
      setSelectedCategory(null);
      setCategoryModels([]);
    } else {
      setViewState('brands');
      setSelectedBrand(null);
      setSelectedCategory(null);
      setCategoryModels([]);
    }
  };

  const handleModelClick = (model: string) => {
    const deviceInfo = {
      brand: selectedBrand?.name || '',
      model: formatModelName(model),
      category: selectedCategory?.name || ''
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

  // Helper to get models from folder
  const getModelsFromFolder = async (brandName: string, folderPath: string): Promise<string[]> => {
    // This is a workaround since we can't dynamically import folder contents
    // We'll manually map the folders to their contents based on what we saw

    const folderContents: Record<string, Record<string, string[]>> = {
      'Samsung': {
        'Series S': [
          's7 edge', 's8', 's8 plus', 's9', 's9 plus', 's10', 's10 plus', 's10 E', 's10 lite',
          's20', 'S20 Plus', 's20 ultra 5g', 's20 fe 5g',
          's21 5g', 's21 plus 5g', 'S21 Ultra 5G', 's21 fe 5g',
          'S22 5G', 'S22 Plus 5g', 'S22 Ultra 5g',
          'S23', 'S23 plus', 's23 Ultra', 's23 fe',
          'S24', 'S24 plus', 'S24 Ultra'
        ].map(m => `Galaxy ${m}`),
        'Series A': [
          'A 01 core', 'A01', 'A02', 'A02 s', 'A03', 'A03 s', 'A03 core', 'A04',
          'A10', 'A10 s', 'A11', 'A12', 'A13', 'A13 5g', 'A14', 'A14 5g', 'A15 5g',
          'A20 s', 'A21', 'A21s', 'A22', 'A22 5G', 'A 23 5g', 'A23',
          'A 30', 'A 30 s', 'A 31', 'A32', 'A 32 5G', 'A33 5g', 'A 34 5g',
          'A 41', 'A 42 5G',
          'A 50', 'A 50 s', 'A 51', 'A 51 5g', 'A 52', 'A 52 5g', 'A52s 5g', 'A 53 5g', 'A 54 5g',
          'A 60',
          'A 70', 'A 70 s', 'A 71', 'A 71 5g', 'A 72', 'A 73 5g',
          'A 80', 'A 90 5G'
        ].map(m => `Galaxy ${m}`),
        'Series M': [
          'M01 core', 'M01', 'M01 S', 'M02', 'M02 S', 'M04',
          'M10', 'M10 s', 'M11', 'M12', 'M13',
          'M20', 'M21',
          'M30', 'M30 S', 'M31', 'M31 S', 'M31 prime', 'M32 4G', 'M32 5G', 'M33 5G', 'M34 5G',
          'M40', 'M42 5G',
          'M51', 'M52 5G', 'M53 5G', 'M54 5G'
        ].map(m => `Galaxy ${m}`),
        'Series Note': [
          'note 8', 'Note 9', 'note 10', 'Note 10 plus', 'Note 10 lite',
          'note 20 5G', 'note 20 ultra 5g'
        ].map(m => m === 'note 8' ? 'galaxy note 8' : `Galaxy ${m}`),
        'Series F': [
          'f02s', 'F04', 'F12', 'F22', 'f23 5g', 'F41 5G', 'F42 5g', 'F54', 'F62'
        ].map(m => `Galaxy ${m}`),
        'Series J': [
          'J6', 'J6 Plus', 'J7', 'J7 Duo', 'J7 Max', 'J7 NXT', 'J7 Prime', 'J7 Pro', 'J8'
        ].map(m => `Galaxy ${m}`),
        'Series Z': [
          'z flip 3 5g', 'Z flip 4 5g', 'Z fold 2', 'Z fold 3 5g', 'Z fold 4'
        ].map(m => `Galaxy ${m}`),
        'Series ON': ['ON 5', 'ON 5 pro', 'ON 6', 'ON 7', 'ON 7 Pro', 'ON 8 2018'].map(m => `Galaxy ${m}`)
      },
      'Xiaomi': {
        'Series MI': [
          'mi 4', 'mi 4i', 'mi 5', 'mi 8',
          'mi 10', 'mi 10 i', 'mi 10 pro', 'mi 10t 5g', 'mi 10t pro 5g',
          'mi 11 5g', 'MI 11 pro 5g', 'mi 11 ultra', 'mi 11 lite', 'mi 11 lite ne 5g',
          'MI 11 hypercharge 5g', 'MI 11T pro 5g', 'MI 11x 5g', 'MI 13 pro 5g',
          'mi a1', 'MI A3', 'mi max', 'mi max prime', 'mi max 2',
          'mi mix', 'mi mix 2', 'mi mix 3', 'mi play'
        ],
        'Series Note': [
          'redmi note 3', 'redmi note 4', 'redmi note 5', 'redmi note 5 pro',
          'redmi note 6 pro', 'redmi note 7', 'redmi note 7 pro', 'redmi note 7s',
          'redmi note 8', 'redmi note 8 pro', 'redmi note 9', 'redmi note 9 pro', 'redmi note 9 pro max',
          'redmi note 10', 'redmi note 10 lite', 'redmi note 10 pro', 'redmi note 10 pro max',
          'redmi note 10s', 'redmi note 10t 5g',
          'redmi note 11 5g', 'redmi note 11 pro', 'redmi note 11 pro plus 5g',
          'redmi note 11 se', 'redmi note 11s', 'Redmi note 11T 5g', 'redmi note 11T pro',
          'Redmi note 12 4g', 'redmi note 12 5g', 'redmi note 12 pro 5g', 'redmi note 12 pro plus 5g'
        ],
        'Series Redmi': [
          'redmi 4', 'redmi 4a', 'redmi 5', 'redmi 5 plus', 'redmi 5a',
          'redmi 6', 'redmi 6 pro', 'redmi 6a', 'redmi 7', 'redmi 7a',
          'redmi 8', 'redmi 8a', 'redmi 8a dual',
          'redmi 9', 'redmi 9 active', 'redmi 9 power', 'redmi 9 prime',
          'redmi 9a', 'redmi 9a sport', 'redmi 9i', 'redmi 9i sport',
          'redmi 10', 'redmi 10 a', 'redmi 10 a sport', 'redmi 10 power', 'redmi 10 prime',
          'redmi 11 prime 5g', 'redmi 12 5g', 'redmi a plus', 'redmi go'
        ],
        'Series X': [
          'Redmi K20', 'Redmi K30', 'Redmi K30 5G', 'Redmi K50 i 5g',
          'Redmi y1 lite', 'Redmi Y1', 'Redmi y2', 'Redmi Y3'
        ],
        'Series A': ['MI A3'],
        'Series K': ['Redmi K20 Pro']
      },
      'VIVO': {
        'series y': [
          'y01', 'y02', 'y3', 'y11', 'y12', 'y12 g', 'y12 s', 'y15', 'y15 c', 'y15 s',
          'y16', 'y17', 'y19', 'y1s',
          'y20', 'y20 a', 'y20 g', 'y20 i', 'y20 t', 'y21', 'y21 a', 'y21 e', 'y21 g', 'y21 t',
          'y22', 'y27', 'y27 5g',
          'y30', 'y31', 'y33 s', 'y33 t', 'y35',
          'y50', 'y51', 'y51 a', 'y53', 'y53 s', 'y56 5g',
          'y66', 'y69', 'y71', 'y72 5g', 'y73', 'y75', 'y75 5g',
          'y81', 'y81 i', 'y83', 'y83 pro', 'y90', 'y91', 'y91i', 'y93', 'y95', 'y100'
        ],
        'series v': [
          'v5', 'v5 plus', 'v5s', 'v7', 'v7 plus', 'v9', 'v9 pro', 'v9 youth',
          'v11', 'v11 pro', 'v15', 'v15 pro', 'v17', 'v17 pro', 'v19',
          'v20', 'v20 pro', 'v20 se', 'v21', 'v21 e',
          'v23 5g', 'v23 e 5g', 'v23 pro', 'v25', 'v25 pro', 'v27', 'v27 pro', 'v29', 'v29 pro'
        ],
        'series x': [
          'x21', 'x50', 'x50 pro', 'x60', 'x60 pro', 'x60 pro plus',
          'x70 pro', 'x70 pro plus', 'x80', 'x80 pro'
        ],
        'series t': ['t1', 't1 x', 't1 5g', 't1 pro 5g', 't2 5g', 't2x 5g'],
        'series s': ['s1', 's1 pro'],
        'series u': ['u10', 'u20'],
        'series z': ['z1', 'z1 pro', 'z1 x'],
        'series nex': ['nex']
      },
      'OPPO': {
        'series a': [
          'a1', 'a1 pro', 'a1k', 'a1x',
          'a3', 'a3 s', 'a5', 'a5 2020', 'a5s',
          'a9', 'a9 2020', 'a9 x',
          'a11 k', 'a11 s', 'a12', 'a12 e',
          'a15', 'a15 s', 'a16', 'a16 e', 'a16 s', 'a16k', 'a17', 'a17 k',
          'a31', 'a32', 'a33 2020', 'a35', 'a36', 'a37', 'a37 f', 'a39',
          'a52', 'a53', 'a53 5g', 'a54', 'a54 s', 'a55', 'a56 5g', 'a57 4g', 'a57 e', 'a57 s', 'a58',
          'a71', 'a72', 'a73', 'a74 5g', 'a76', 'a77', 'a77s', 'a78 5g', 'a7x',
          'a83', 'a91', 'a92', 'a92s', 'a93', 'a93s 5g', 'a94', 'a95', 'a96', 'a97'
        ],
        'series f': ['f15', 'f19', 'f19 pro', 'f19 pro plus 5g', 'f21 s pro 5g'],
        'series reno': ['reno 10x zoom', 'reno 2z', 'reno 5 pro 5g', 'reno 6 5g', 'reno 7 5g', 'reno 8 5g', 'reno 10 5g', 'reno 10 pro plus 5g']
      },
      'Motorolla': {
        'series g': [
          'g 31', 'g 32', 'g 34 5g', 'g 40 fusion', 'g 52', 'g 54 5g', 'g 5g', 'g 60',
          'g 62 5g', 'g 71 5g', 'g 72', 'g 82 5g', 'g 84', 'g power', 'g7 power',
          'g8 plus', 'moto g 30'
        ],
        'series e': ['E 13', 'E 30', 'Motorolla E 40'],
        'series x': [
          'edge 20', 'edge 20 fusion', 'edge 30', 'edge 40', 'edge 40 neo',
          'edge 50 fusion', 'edge 50 pro', 'edge plus',
          'one action', 'one fusion plus', 'one power'
        ]
      },
      'Realme': {
        'series x': ['realme x', 'realme x2', 'realme x3', 'realme x50 pro 5g', 'realme x7 max 5g', 'realme x7 pro 5g', 'realme xt']
      },
      'POCO': {
        'series m': ['poco f1', 'poco m3 pro 5g', 'poco m3 pro', 'poco m4 pro 4g', 'poco x2', 'poco x3 pro', 'poco x4 pro 5g']
      }
    };

    return folderContents[brandName]?.[folderPath] || [];
  };

  const getDisplayModels = () => {
    // return array of objects { model, image }
    const modelsArr: Array<{ model: string; image?: string | null }> = [];

    // Add custom models first (admin-added)
    if (customModels && customModels.length > 0) {
      // For brands with categories, only show models matching the selected category/series
      // For brands without categories, show all models
      const filteredCustomModels = customModels.filter(m => {
        // If brand has categories but none selected, don't show any
        if (selectedBrand?.hasCategories && !selectedCategory) {
          return false;
        }

        // If brand has categories and one is selected, filter by series
        if (selectedBrand?.hasCategories && selectedCategory) {
          // Match series (case insensitive, handle variations)
          const modelSeries = (m.series || '').toLowerCase().trim();
          const categoryName = selectedCategory.name.toLowerCase().trim();
          const categoryFolder = selectedCategory.folder.toLowerCase().trim();

          // Try multiple matching strategies
          const matches =
            modelSeries === categoryName ||
            modelSeries === categoryFolder ||
            modelSeries.includes(categoryName) ||
            categoryName.includes(modelSeries) ||
            // Also try removing "series" word from both
            modelSeries.replace('series', '').trim() === categoryName.replace('series', '').trim() ||
            modelSeries.replace('series', '').trim() === categoryFolder.replace('series', '').trim();

          return matches;
        }

        // If brand doesn't have categories, show models without series or show all
        if (!selectedBrand?.hasCategories) {
          return !m.series || m.series.trim() === '';
        }

        return false;
      });

      for (const m of filteredCustomModels) {
        modelsArr.push({ model: m.model, image: m.image_url || null });
      }
    }

    // Then add category/brand built-in models
    const sourceModels = selectedCategory ? categoryModels : (selectedBrand?.models ?? selectedBrand?.directModels ?? []);
    for (const m of sourceModels) {
      modelsArr.push({ model: m, image: null });
    }

    return modelsArr;
  };

  const getModelImagePath = (model: string) => {
    if (!selectedBrand) return '';

    const brandName = selectedBrand.name;
    const folderPath = selectedCategory?.folder || '';

    if (folderPath) {
      return `/images/${brandName}/${folderPath}/${model}.webp`;
    }
    return `/images/${brandName}/${model}.webp`;
  };

  const formatModelName = (model: string) => {
    // Clean up model name for display
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
            {viewState === 'categories' && `${selectedBrand?.name} Categories`}
            {viewState === 'models' && (selectedCategory ? selectedCategory.name : `${selectedBrand?.name} Models`)}
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

        {/* Brands Grid - flex with justify-center to center last row when incomplete */}
        {viewState === 'brands' && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {displayedBrands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => handleBrandClick(brand)}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-200 group w-24 sm:w-28 md:w-32 flex-shrink-0"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{brand.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {viewState === 'categories' && selectedBrand?.categories && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {selectedBrand.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className="p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">View Models →</p>
              </button>
            ))}
            {selectedBrand.directModels && (
              <button
                onClick={() => {
                  setCategoryModels(selectedBrand.directModels || []);
                  setSelectedCategory({ name: 'Other Models', folder: '' });
                  setViewState('models');
                }}
                className="p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Other Models</h3>
                <p className="text-sm text-gray-500">View Models →</p>
              </button>
            )}
          </div>
        )}

        {/* Models Grid */}
        {viewState === 'models' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {getDisplayModels().map((entry, idx) => (
              <button
                key={`${entry.model}-${idx}`}
                onClick={() => handleModelClick(entry.model)}
                className="flex flex-col items-center gap-3 p-3 bg-white rounded-xl hover:shadow-lg transition-all duration-200 group cursor-pointer border-2 border-transparent hover:border-blue-500"
              >
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={entry.image ?? getModelImagePath(entry.model)}
                    alt={entry.model}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center line-clamp-2">
                  {formatModelName(entry.model)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

