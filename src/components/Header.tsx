import { Receipt, UtensilsCrossed } from 'lucide-react';

interface Props {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReceipt: () => void;
}

export function Header({ cartCount, onOpenCart, onOpenReceipt }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-ink-50/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-pop">
            <UtensilsCrossed className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-700 tracking-tight text-ink-900">
              Campus SnackPass
            </p>
            <p className="hidden text-xs font-medium text-ink-500 sm:block">
              Skip the queue. Order ahead.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReceipt}
            className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-600 text-ink-700 transition-all hover:border-ink-300 hover:bg-ink-50 active:scale-95"
          >
            <Receipt className="h-4 w-4 text-brand-600" strokeWidth={2.2} />
            <span className="hidden sm:inline">View Bill</span>
          </button>

          <button
            onClick={onOpenCart}
            className="group relative flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-600 text-white transition-all hover:bg-ink-800 active:scale-95"
          >
            <span className="hidden sm:inline">Your order</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-700 tabular-nums shadow-pop">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
