import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { ShopService } from '@/services/shopService';
import { ShopProduct, ShopCategory, ProductFilter, SHOP_CATEGORIES } from '@/types/shop';
import { useCart } from '@/lib/cart';
import { formatNPR } from '@/config/mobizilla';

const CATEGORY_ICONS: Record<ShopCategory, string> = {
  phones: '📱',
  accessories: '🎧',
  parts: '🔩',
  machineries: '🔧',
  secondhand: '♻️',
  inventories: '📦',
};

function ProductCard({ product }: { product: ShopProduct }) {
  const cart = useCart();
  const finalPrice = product.discount_percent
    ? Math.round(product.price * (1 - product.discount_percent / 100))
    : product.price;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 flex flex-col">
      <Link to={`/shop/${product.category}/${product.id}`} className="block">
        <div className="aspect-square bg-gray-50 rounded-t-lg overflow-hidden">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        )}
        <Link to={`/shop/${product.category}/${product.id}`} className="hover:underline">
          <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
        </Link>
        {product.condition && (
          <Badge variant="outline" className="w-fit text-xs mb-2">
            {product.condition}
          </Badge>
        )}
        {product.status === 'sold' && (
          <Badge variant="destructive" className="w-fit text-xs mb-2">Sold</Badge>
        )}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            {product.price > 0 ? (
              <>
                <span className="font-semibold text-base">{formatNPR(finalPrice)}</span>
                {product.discount_percent && product.discount_percent > 0 && (
                  <span className="text-xs text-muted-foreground line-through">{formatNPR(product.price)}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Price on request</span>
            )}
          </div>
          <Button
            size="sm"
            className="w-full"
            disabled={product.status === 'sold'}
            onClick={() =>
              cart.add(
                {
                  id: product.id,
                  name: product.name,
                  unitPrice: finalPrice || product.price,
                  price: finalPrice || product.price,
                },
                1
              )
            }
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Buy() {
  const { category: categoryParam } = useParams<{ category?: ShopCategory }>();
  const navigate = useNavigate();

  const activeCategory: ShopCategory = (categoryParam as ShopCategory) || 'phones';

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProductFilter>({ sortBy: 'newest' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFilter({ sortBy: 'newest' });
    Promise.all([
      ShopService.getProductsByCategory(activeCategory),
      ShopService.getBrands(activeCategory),
    ]).then(([prods, brandList]) => {
      setProducts(prods);
      setBrands(brandList);
      setLoading(false);
    });
  }, [activeCategory]);

  const filtered = useMemo(
    () => ShopService.applyFilters(products, filter),
    [products, filter]
  );

  const categoryMeta = SHOP_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Shop — {categoryMeta?.label ?? 'Store'} | Mobizilla</title>
        <meta
          name="description"
          content={`Buy ${categoryMeta?.label ?? 'products'} at Mobizilla. Genuine products, best prices in Nepal.`}
        />
      </Helmet>

      {/* Page header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-1">Mobizilla Store</h1>
          <p className="text-muted-foreground text-sm">Genuine products. Best prices in Nepal.</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b sticky top-[64px] md:top-[80px] z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {SHOP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/shop/${cat.id}`)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <span>{CATEGORY_ICONS[cat.id]}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${categoryMeta?.label ?? 'products'}...`}
              className="pl-9"
              value={filter.search ?? ''}
              onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={filter.sortBy ?? 'newest'}
              onChange={(e) =>
                setFilter((f) => ({ ...f, sortBy: e.target.value as ProductFilter['sortBy'] }))
              }
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
            {brands.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
                className="gap-1.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
                <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && brands.length > 0 && (
          <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Filter by Brand</h3>
              {filter.brand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter((f) => ({ ...f, brand: undefined }))}
                  className="h-7 text-xs gap-1 text-muted-foreground"
                >
                  <X className="h-3 w-3" /> Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() =>
                    setFilter((f) => ({ ...f, brand: f.brand === brand ? undefined : brand }))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    filter.brand === brand
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {(filter.brand || filter.search) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filter.brand && (
              <Badge variant="secondary" className="gap-1">
                Brand: {filter.brand}
                <button onClick={() => setFilter((f) => ({ ...f, brand: undefined }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filter.search && (
              <Badge variant="secondary" className="gap-1">
                "{filter.search}"
                <button onClick={() => setFilter((f) => ({ ...f, search: '' }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} in{' '}
            <strong>{categoryMeta?.label}</strong>
          </p>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🛍️</p>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {filter.search || filter.brand
                ? 'Try adjusting your filters.'
                : `No ${categoryMeta?.label.toLowerCase()} have been added yet.`}
            </p>
            {(filter.search || filter.brand) && (
              <Button
                variant="outline"
                onClick={() => setFilter({ sortBy: 'newest' })}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Trust bar */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '✓', title: 'Genuine Products', sub: '100% authentic' },
              { icon: '🚚', title: 'Fast Delivery', sub: 'Same-day available' },
              { icon: '🛡', title: 'Warranty', sub: 'Manufacturer warranty' },
              { icon: '💰', title: 'Best Prices', sub: 'Competitive pricing' },
            ].map((item) => (
              <div key={item.title}>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
