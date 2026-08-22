import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/types';
import type { Category } from '@/types';

interface Props {
  active: Category | 'all';
  onChange: (c: Category | 'all') => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ active, onChange, counts }: Props) {
  const tabs: { key: Category | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: Object.values(counts).reduce((a, b) => a + b, 0) },
    ...CATEGORY_ORDER.map((c) => ({ key: c, label: CATEGORY_LABELS[c], count: counts[c] ?? 0 })),
  ];

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-600 transition-all active:scale-95 ${
              isActive
                ? 'border-ink-900 bg-ink-900 text-white shadow-sm'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50'
            }`}
          >
            {tab.label}
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-700 tabular-nums ${
                isActive ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
