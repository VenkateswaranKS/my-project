import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartLine, MenuItem } from '@/types';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  getQuantity: (id: string) => number;
  add: (item: MenuItem) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Map<string, CartLine>>(() => new Map());

  const add = useCallback((item: MenuItem) => {
    setMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      next.set(item.id, { item, quantity: existing ? existing.quantity + 1 : 1 });
      return next;
    });
  }, []);

  const increment = useCallback((id: string) => {
    setMap((prev) => {
      const existing = prev.get(id);
      if (!existing) return prev;
      const next = new Map(prev);
      next.set(id, { ...existing, quantity: existing.quantity + 1 });
      return next;
    });
  }, []);

  const decrement = useCallback((id: string) => {
    setMap((prev) => {
      const existing = prev.get(id);
      if (!existing) return prev;
      const next = new Map(prev);
      if (existing.quantity <= 1) {
        next.delete(id);
      } else {
        next.set(id, { ...existing, quantity: existing.quantity - 1 });
      }
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setMap(() => new Map()), []);

  const getQuantity = useCallback(
    (id: string) => map.get(id)?.quantity ?? 0,
    [map],
  );

  const lines = useMemo(() => Array.from(map.values()), [map]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);
  const total = useMemo(
    () => lines.reduce((s, l) => s + l.item.price * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ lines, count, total, getQuantity, add, increment, decrement, remove, clear }),
    [lines, count, total, getQuantity, add, increment, decrement, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
