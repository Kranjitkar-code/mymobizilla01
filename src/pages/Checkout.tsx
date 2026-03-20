import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { Link } from 'react-router-dom';
import { MOBIZILLA, formatNPR, calcOrderTotals } from '@/config/mobizilla';
import { useState } from 'react';

export default function Checkout() {
  const cart = useCart();
  const [selectedZone, setSelectedZone] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<string>('esewa');

  const shippingFee = MOBIZILLA.shipping.zones[selectedZone]?.fee ?? MOBIZILLA.shipping.defaultFee;
  const totals = calcOrderTotals(Math.round(cart.total), shippingFee);

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Shopping Cart — Mobizilla Nepal</title>
        <meta name="description" content="Review your cart and proceed to checkout at Mobizilla Nepal." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-xl text-gray-600">Review your items and proceed to checkout</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {cart.items.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some products to get started</p>
                <Link to="/buy">
                  <Button>Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Cart ({cart.items.length} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatNPR((item.price || 0) * item.quantity)}</p>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cart.remove(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Zone Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {MOBIZILLA.shipping.zones.map((zone, idx) => (
                      <label
                        key={zone.name}
                        className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedZone === idx ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping-zone"
                            checked={selectedZone === idx}
                            onChange={() => setSelectedZone(idx)}
                            className="accent-primary"
                          />
                          <span className="font-medium">{zone.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{zone.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {MOBIZILLA.payments.providers.map((provider) => (
                      <label
                        key={provider}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPayment === provider ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPayment === provider}
                          onChange={() => setSelectedPayment(provider)}
                          className="accent-primary"
                        />
                        <span className="font-medium">{MOBIZILLA.payments.labels[provider]}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Pay via {MOBIZILLA.payments.labels[selectedPayment]} to our merchant ID. Send screenshot to {MOBIZILLA.contact.phone2}
                  </p>
                  {/* TODO: Integrate eSewa SDK — https://developer.esewa.com.np */}
                  {/* TODO: Integrate Khalti SDK — https://khalti.com/api/v2/ */}
                </CardContent>
              </Card>

              {/* Order Summary with VAT */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatNPR(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{MOBIZILLA.tax.label} ({MOBIZILLA.tax.percent}%)</span>
                      <span>{formatNPR(totals.vat)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping ({MOBIZILLA.shipping.zones[selectedZone]?.name})</span>
                      <span>{shippingFee === 0 ? 'Free' : formatNPR(totals.shipping)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatNPR(totals.total)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Price includes {MOBIZILLA.tax.percent}% {MOBIZILLA.tax.label}</p>
                  </div>
                  <Button size="lg" className="w-full mt-4">
                    Place Order — {formatNPR(totals.total)}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
