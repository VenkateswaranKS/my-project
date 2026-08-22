import { Minus, Plus } from 'lucide-react';
import type { MenuItem } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

interface Props {
  item: MenuItem;
}

export function MenuItemCard({ item }: Props) {
  const { getQuantity, add, increment, decrement } = useCart();
  const qty = getQuantity(item.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[5/3] overflow-hidden bg-ink-100">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-700 text-ink-900 shadow-sm backdrop-blur">
          {formatPrice(item.price)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-600 leading-snug text-ink-900">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          {qty === 0 ? (
            <button
              onClick={() => add(item)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-700 text-white shadow-pop transition-all hover:bg-brand-600 active:scale-95"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              Add to order
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between gap-1 rounded-xl bg-ink-100 p-1">
              <button
                onClick={() => decrement(item.id)}
                aria-label={`Remove one ${item.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-700 shadow-sm transition-all hover:bg-ink-50 active:scale-90"
              >
                <Minus className="h-4 w-4" strokeWidth={2.6} />
              </button>
              <span
                key={qty}
                className="animate-pop-qty font-display text-base font-700 tabular-nums text-ink-900"
              >
                {qty}
              </span>
              <button
                onClick={() => increment(item.id)}
                aria-label={`Add one ${item.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-pop transition-all hover:bg-brand-600 active:scale-90"
              >
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
