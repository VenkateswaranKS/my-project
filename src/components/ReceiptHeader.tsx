import { UtensilsCrossed } from 'lucide-react';

export function ReceiptHeader() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
        <UtensilsCrossed className="h-6 w-6" strokeWidth={2.4} />
      </div>
      <h1 className="mt-2 font-display text-xl font-700 tracking-tight text-ink-900">
        Campus SnackPass
      </h1>
      <p className="text-xs text-ink-500">South Indian Canteen</p>
      <p className="mt-0.5 text-[11px] text-ink-400">
        Campus Block C, Ground Floor
      </p>
      <p className="text-[11px] text-ink-400">Tel: +91 98765 43210</p>
    </div>
  );
}
