import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { ShopService } from '@/services/shopService';
import { ShopProduct, ShopCategory, SHOP_CATEGORIES } from '@/types/shop';
import { useCart } from '@/lib/cart';
import { formatNPR } from '@/config/mobizilla';

export default function Product() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const cart = useCart();

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [related, setRelated] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const shopCategory = category as ShopCategory;
  const categoryMeta = SHOP_CATEGORIES.find((c) => c.id === shopCategory);

  useEffect(() => {
    if (!shopCategory || !id) return;
    setLoading(true);
    ShopService.getProductById(shopCategory, id).then((p) => {
      setProduct(p);
      setLoading(false);
      if (p) {
        ShopService.getProductsByCategory(shopCategory).then((all) => {
          setRelated(all.filter((r) => r.id !== id).slice(0, 4));
        });
      }
    });
  }, [shopCategory, id]);

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = product.discount_percent
      ? Math.round(product.price * (1 - product.discount_percent / 100))
      : product.price;
    cart.add({ id: product.id, name: product.name, unitPrice: finalPrice, price: finalPrice }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-10 bg-gray-200 rounded w-1/3 mt-6" />
            <div className="flex gap-3 mt-4">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">This product may have been removed or is no longer available.</p>
        <Button asChild>
          <Link to={`/shop/${shopCategory ?? 'phones'}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const finalPrice = product.discount_percent
    ? Math.round(product.price * (1 - product.discount_percent / 100))
    : product.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{product.name} — Mobizilla</title>
        <meta
          name="description"
          content={product.description ?? `Buy ${product.name} at Mobizilla. Best price in Nepal.`}
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            <span>/</span>
            <Link to={`/shop/${shopCategory}`} className="hover:text-primary capitalize">
              {categoryMeta?.label ?? shopCategory}
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  className="w-full aspect-square object-cover"
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.brand && (
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            )}
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.condition && (
                <Badge variant="outline">{product.condition}</Badge>
              )}
              {product.status === 'sold' && (
                <Badge variant="destructive">Sold Out</Badge>
              )}
              {product.stock !== null && product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                <Badge variant="secondary">Only {product.stock} left</Badge>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {product.price > 0 ? (
                <>
                  <span className="text-3xl font-bold">{formatNPR(finalPrice)}</span>
                  {product.discount_percent && product.discount_percent > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatNPR(product.price)}
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {product.discount_percent}% off
                      </Badge>
                    </>
                  )}
                </>
              ) : (
                <span className="text-xl text-muted-foreground">Price on request</span>
              )}
            </div>

            {/* Product details */}
            {(product.model || product.series || product.sku) && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6 bg-gray-50 rounded-lg p-4">
                {product.model && (
                  <>
                    <dt className="text-muted-foreground">Model</dt>
                    <dd className="font-medium">{product.model}</dd>
                  </>
                )}
                {product.series && (
                  <>
                    <dt className="text-muted-foreground">Series</dt>
                    <dd className="font-medium">{product.series}</dd>
                  </>
                )}
                {product.sku && (
                  <>
                    <dt className="text-muted-foreground">SKU</dt>
                    <dd className="font-medium font-mono">{product.sku}</dd>
                  </>
                )}
                {product.stock !== null && product.stock !== undefined && (
                  <>
                    <dt className="text-muted-foreground">In Stock</dt>
                    <dd className="font-medium">{product.stock > 0 ? `${product.stock} units` : 'Out of stock'}</dd>
                  </>
                )}
              </dl>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.status === 'sold' || added}
              >
                <ShoppingCart className="h-4 w-4" />
                {added ? 'Added!' : 'Add to Cart'}
              </Button>
              <Button variant="secondary" asChild className="flex-1">
                <Link to="/checkout">Buy Now</Link>
              </Button>
            </div>

            {/* Back link */}
            <Link
              to={`/shop/${shopCategory}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to {categoryMeta?.label ?? 'Shop'}
            </Link>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">More {categoryMeta?.label ?? 'Products'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => {
                const rFinal = r.discount_percent
                  ? Math.round(r.price * (1 - r.discount_percent / 100))
                  : r.price;
                return (
                  <Card key={r.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                        <img
                          src={r.image_url || '/placeholder.svg'}
                          alt={r.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <Link to={`/shop/${r.category}/${r.id}`} className="font-medium text-sm hover:underline line-clamp-2 block mb-1">
                        {r.name}
                      </Link>
                      {r.price > 0 && (
                        <p className="text-sm font-semibold text-primary">{formatNPR(rFinal)}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
