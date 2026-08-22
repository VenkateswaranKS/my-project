import { Minus, Plus, ShoppingBag, Trash2, X, Loader as Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export function CartPanel({ open, onClose, onConfirm, submitting }: Props) {
  const { lines, count, total, increment, decrement, remove, clear } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-ink-50 shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100vh-4rem)] lg:w-[380px] lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none lg:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-600" strokeWidth={2.2} />
            <h2 className="font-display text-lg font-700 text-ink-900">Your order</h2>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-100 px-1.5 text-[11px] font-700 text-brand-700">
                {count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {lines.length > 0 && (
              <button
                onClick={clear}
                className="rounded-lg px-2 py-1 text-xs font-600 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:hidden"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100">
              <ShoppingBag className="h-7 w-7 text-ink-400" />
            </div>
            <p className="font-display text-base font-600 text-ink-700">
              Your cart is empty
            </p>
            <p className="text-sm text-ink-500">
              Add some snacks from the menu to get started.
            </p>
          </div>
        ) : (
          <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
            {lines.map((line) => (
              <div
                key={line.item.id}
                className="animate-fade-in flex gap-3 rounded-xl border border-ink-100 bg-white p-3"
              >
                <img
                  src={line.item.image_url}
                  alt={line.item.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="truncate text-sm font-600 text-ink-900">
                      {line.item.name}
                    </h4>
                    <button
                      onClick={() => remove(line.item.id)}
                      aria-label={`Remove ${line.item.name}`}
                      className="shrink-0 text-ink-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-ink-500">{formatPrice(line.item.price)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-lg bg-ink-100 p-0.5">
                      <button
                        onClick={() => decrement(line.item.id)}
                        aria-label={`Remove one ${line.item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink-700 shadow-sm transition-all hover:bg-ink-50 active:scale-90"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={2.6} />
                      </button>
                      <span className="w-7 text-center text-sm font-700 tabular-nums text-ink-900">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => increment(line.item.id)}
                        aria-label={`Add one ${line.item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white shadow-pop transition-all hover:bg-brand-600 active:scale-90"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                      </button>
                    </div>
                    <span className="text-sm font-700 tabular-nums text-ink-900">
                      {formatPrice(line.item.price * line.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {lines.length > 0 && (
          <div className="border-t border-ink-100 bg-white p-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm text-ink-500">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-ink-500">
                <span>Service fee</span>
                <span className="tabular-nums">Free</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="font-display text-base font-700 text-ink-900">Total</span>
                <span className="font-display text-xl font-700 tabular-nums text-brand-600">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              onClick={onConfirm}
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-base font-700 text-white shadow-pop transition-all hover:bg-brand-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Placing order…
                </>
              ) : (
                <>Confirm &amp; get token</>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-ink-400">
              You'll get a unique token to collect your food.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
