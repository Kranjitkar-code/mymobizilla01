import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type CartItem = {
  price: number;
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

type CartContextType = {
  total: any;
  addItem(product: any): void;
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const api: CartContextType = useMemo(() => ({
    total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    addItem: (product: any) => {
      setItems((prev) => [...prev, { ...product, quantity: 1 }]);
    },
    items,
    add: (item, qty = 1) => {
      setItems((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) {
          return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p));
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
    setQuantity: (id, qty) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))),
    clear: () => setItems([]),
    subtotal: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    count: items.reduce((sum, i) => sum + i.quantity, 0),
  }), [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


