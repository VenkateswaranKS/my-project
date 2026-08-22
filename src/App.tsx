import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MenuGrid } from '@/components/MenuGrid';
import { CartPanel } from '@/components/CartPanel';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { ReceiptLookup } from '@/components/ReceiptLookup';
import { fetchMenu, createOrder } from '@/lib/api';
import type { Category, MenuItem, Order, OrderItemRow } from '@/types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '@/types';

function SnackPassApp() {
  const cart = useCart();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [cartOpen, setCartOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<{
    order: Order;
    items: OrderItemRow[];
  } | null>(null);
  const [receiptLookupOpen, setReceiptLookupOpen] = useState(false);
  const [lastToken, setLastToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMenu()
      .then((items) => {
        if (cancelled) return;
        setMenu(items);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Something went wrong loading the menu.';
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const item of menu) c[item.category] = (c[item.category] ?? 0) + 1;
    return c;
  }, [menu]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menu;
    return menu.filter((m) => m.category === activeCategory);
  }, [menu, activeCategory]);

  const groupedItems = useMemo(() => {
    if (activeCategory !== 'all') return null;
    const groups: { category: Category; items: MenuItem[] }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const items = menu.filter((m) => m.category === cat);
      if (items.length > 0) groups.push({ category: cat, items });
    }
    return groups;
  }, [menu, activeCategory]);

  const handleConfirm = useCallback(async () => {
    if (cart.lines.length === 0 || submitting) return;
    setSubmitting(true);
    setConfirmError(null);
    try {
      const result = await createOrder(cart.lines);
      cart.clear();
      setCartOpen(false);
      setLastToken(result.order.token);
      setLastOrder(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not place your order. Please try again.';
      setConfirmError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [cart, submitting]);

  return (
    <div className="min-h-screen bg-ink-50">
      <Header
        cartCount={cart.count}
        onOpenCart={() => setCartOpen(true)}
        onOpenReceipt={() => setReceiptLookupOpen(true)}
      />

      <main>
        <Hero itemCount={menu.length} />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1">
              <div className="sticky top-16 z-20 -mx-4 bg-ink-50/80 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:px-0">
                <CategoryFilter
                  active={activeCategory}
                  onChange={setActiveCategory}
                  counts={counts}
                />
              </div>

              {confirmError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-600 text-red-700">
                  {confirmError}
                </div>
              )}

              {loading ? (
                <div className="mt-6">
                  <MenuGrid items={[]} loading={true} error={null} />
                </div>
              ) : groupedItems ? (
                <div className="mt-6 space-y-10">
                  {groupedItems.map((group) => (
                    <section key={group.category} id={group.category} className="scroll-mt-32">
                      <div className="mb-4 flex items-baseline justify-between">
                        <h2 className="font-display text-xl font-700 text-ink-900">
                          {CATEGORY_LABELS[group.category]}
                        </h2>
                        <span className="text-sm font-500 text-ink-400">
                          {group.items.length} items
                        </span>
                      </div>
                      <MenuGrid items={group.items} loading={false} error={null} />
                    </section>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <MenuGrid items={filteredItems} loading={false} error={error} />
                </div>
              )}
            </div>

            <CartPanel
              open={cartOpen}
              onClose={() => setCartOpen(false)}
              onConfirm={handleConfirm}
              submitting={submitting}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-ink-400 sm:px-6 lg:px-8">
          Campus SnackPass — a demo ordering experience. No real payments, no real food.
        </div>
      </footer>

      {lastOrder && (
        <OrderConfirmation
          order={lastOrder.order}
          items={lastOrder.items}
          onClose={() => setLastOrder(null)}
        />
      )}

      <ReceiptLookup
        open={receiptLookupOpen}
        onClose={() => setReceiptLookupOpen(false)}
        initialToken={lastToken}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <SnackPassApp />
    </CartProvider>
  );
}
