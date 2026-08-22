import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/MenuItemCard';

export function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="relative aspect-[5/3] overflow-hidden bg-ink-100">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 rounded-full bg-ink-100" />
        <div className="h-3 w-full rounded-full bg-ink-100" />
        <div className="h-3 w-1/2 rounded-full bg-ink-100" />
        <div className="h-10 w-full rounded-xl bg-ink-100" />
      </div>
    </div>
  );
}

interface Props {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

export function MenuGrid({ items, loading, error }: Props) {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-600 text-red-700">Couldn't load the menu</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-12 text-center">
        <p className="font-display text-lg font-600 text-ink-900">No items here</p>
        <p className="mt-1 text-sm text-ink-500">Try a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
