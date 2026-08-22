import { Clock, Zap, ShieldCheck } from 'lucide-react';

export function Hero({ itemCount }: { itemCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 text-white">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #ff9a33 0, transparent 45%), radial-gradient(circle at 80% 70%, #ff7a0a 0, transparent 40%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-600 uppercase tracking-wider text-brand-200 ring-1 ring-white/15">
            <Zap className="h-3.5 w-3.5" strokeWidth={2.6} /> Campus canteen
          </span>
          <h1 className="mt-4 font-display text-3xl font-700 leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Skip the queue.{' '}
            <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
              Order ahead.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-200 sm:text-lg">
            Hot dosas, fluffy idlis, filter coffee and more. Build your order in
            seconds and grab a collection token — no more waiting in line.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-sm font-500 text-ink-200">
              <Clock className="h-4 w-4 text-brand-300" strokeWidth={2.2} />
              Ready in minutes
            </div>
            <div className="flex items-center gap-2 text-sm font-500 text-ink-200">
              <ShieldCheck className="h-4 w-4 text-brand-300" strokeWidth={2.2} />
              No account needed
            </div>
            {itemCount > 0 && (
              <div className="flex items-center gap-2 text-sm font-500 text-ink-200">
                <Zap className="h-4 w-4 text-brand-300" strokeWidth={2.2} />
                {itemCount} items on the menu
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
