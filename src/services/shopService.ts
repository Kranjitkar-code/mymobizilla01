import { supabase } from '@/integrations/supabase/client';
import { ShopProduct, ShopCategory, ProductFilter } from '@/types/shop';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';

// Normalize phone_models row into ShopProduct
function phoneToShopProduct(row: any): ShopProduct {
  return {
    id: String(row.id),
    name: row.model ? `${row.brand} ${row.model}` : row.name ?? 'Unknown',
    description: row.description ?? null,
    price: row.base_price ?? row.price ?? 0,
    image_url: row.image_url ?? null,
    brand: row.brand ?? null,
    model: row.model ?? null,
    series: row.series ?? null,
    category: 'phones',
    created_at: row.created_at ?? null,
  };
}

// Normalize accessories/parts rows into ShopProduct
function genericToShopProduct(row: any, category: ShopCategory): ShopProduct {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description ?? null,
    price: typeof row.price === 'string' ? parseFloat(row.price) || 0 : (row.price ?? 0),
    image_url: row.image_url ?? null,
    brand: row.brand ?? null,
    model: row.model ?? null,
    stock: row.stock ?? row.quantity ?? null,
    sku: row.sku ?? null,
    condition: row.condition ?? null,
    status: row.status ?? null,
    category,
    created_at: row.created_at ?? null,
  };
}

// Convert MOCK_PRODUCTS to ShopProduct for fallback
function mockToShopProduct(p: typeof MOCK_PRODUCTS[0]): ShopProduct {
  const categoryMap: Record<string, ShopCategory> = {
    'cat-phones': 'phones',
    'cat-accessories': 'accessories',
    'cat-parts': 'parts',
    'cat-tools': 'machineries',
  };
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price_npr,
    discount_percent: p.discount_percent,
    image_url: p.image_url,
    brand: p.brand,
    category: categoryMap[p.category_id] ?? 'inventories',
  };
}

async function fetchFromSupabase(table: string, category: ShopCategory): Promise<ShopProduct[]> {
  const { data, error } = await (supabase as any)
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('empty');

  return (data as any[]).map((row) =>
    category === 'phones' ? phoneToShopProduct(row) : genericToShopProduct(row, category)
  );
}

export const ShopService = {
  async getProductsByCategory(category: ShopCategory): Promise<ShopProduct[]> {
    const tableMap: Record<ShopCategory, string> = {
      phones: 'phone_models',
      accessories: 'accessories',
      parts: 'parts',
      machineries: 'machineries',
      secondhand: 'secondhand_inventory',
      inventories: 'inventories',
    };

    try {
      const products = await fetchFromSupabase(tableMap[category], category);
      return products;
    } catch {
      // Fallback to mock data for phones and accessories
      if (category === 'phones') {
        return MOCK_PRODUCTS.filter((p) => p.category_id === 'cat-phones').map(mockToShopProduct);
      }
      if (category === 'accessories') {
        return MOCK_PRODUCTS.filter((p) => p.category_id === 'cat-accessories').map(mockToShopProduct);
      }
      if (category === 'parts') {
        return MOCK_PRODUCTS.filter((p) => p.category_id === 'cat-parts').map(mockToShopProduct);
      }
      if (category === 'machineries') {
        return MOCK_PRODUCTS.filter((p) => p.category_id === 'cat-tools').map(mockToShopProduct);
      }
      return [];
    }
  },

  async getProductById(category: ShopCategory, id: string): Promise<ShopProduct | null> {
    const tableMap: Record<ShopCategory, string> = {
      phones: 'phone_models',
      accessories: 'accessories',
      parts: 'parts',
      machineries: 'machineries',
      secondhand: 'secondhand_inventory',
      inventories: 'inventories',
    };

    try {
      const { data, error } = await (supabase as any)
        .from(tableMap[category])
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) throw new Error('not found');
      return category === 'phones'
        ? phoneToShopProduct(data)
        : genericToShopProduct(data, category);
    } catch {
      // Fallback to mock
      const mock = MOCK_PRODUCTS.find((p) => p.id === id);
      if (mock) return mockToShopProduct(mock);
      return null;
    }
  },

  async getAllProducts(): Promise<ShopProduct[]> {
    const categories: ShopCategory[] = ['phones', 'accessories', 'parts', 'machineries', 'secondhand', 'inventories'];
    const results = await Promise.allSettled(
      categories.map((cat) => ShopService.getProductsByCategory(cat))
    );
    return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  },

  async getBrands(category?: ShopCategory): Promise<string[]> {
    try {
      if (!category || category === 'phones') {
        const { data, error } = await (supabase as any)
          .from('brands')
          .select('name')
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) {
          return (data as any[]).map((b) => b.name);
        }
      }
      // For other categories, collect brands from products
      const products = category
        ? await ShopService.getProductsByCategory(category)
        : await ShopService.getAllProducts();
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean) as string[])];
      return brands.sort();
    } catch {
      return [];
    }
  },

  applyFilters(products: ShopProduct[], filter: ProductFilter): ShopProduct[] {
    let result = [...products];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand?.toLowerCase().includes(q) ?? false) ||
          (p.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (filter.brand) {
      result = result.filter((p) => p.brand === filter.brand);
    }

    if (filter.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    if (filter.inStockOnly) {
      result = result.filter((p) => p.stock == null || p.stock > 0);
    }

    if (filter.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  },
};
