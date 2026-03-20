export type ShopCategory =
  | 'phones'
  | 'accessories'
  | 'parts'
  | 'machineries'
  | 'secondhand'
  | 'inventories';

export interface ShopCategoryMeta {
  id: ShopCategory;
  label: string;
  description: string;
  table: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discount_percent?: number;
  image_url?: string | null;
  brand?: string | null;
  model?: string | null;
  stock?: number | null;
  condition?: string | null;
  status?: string | null;
  category: ShopCategory;
  created_at?: string | null;
  sku?: string | null;
  series?: string | null;
}

export interface ProductFilter {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  inStockOnly?: boolean;
}

export const SHOP_CATEGORIES: ShopCategoryMeta[] = [
  { id: 'phones', label: 'Phones', description: 'Latest smartphones', table: 'phone_models' },
  { id: 'accessories', label: 'Accessories', description: 'Cases, chargers & more', table: 'accessories' },
  { id: 'parts', label: 'Parts', description: 'Repair parts & components', table: 'parts' },
  { id: 'machineries', label: 'Machinery', description: 'Repair tools & equipment', table: 'machineries' },
  { id: 'secondhand', label: 'Secondhand', description: 'Pre-owned devices', table: 'secondhand_inventory' },
  { id: 'inventories', label: 'Inventory', description: 'General stock items', table: 'inventories' },
];
