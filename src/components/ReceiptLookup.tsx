import { useEffect, useState } from 'react';
import { Search, Receipt as ReceiptIcon, X, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';
import { fetchOrderByToken } from '@/lib/api';
import type { Order, OrderItemRow } from '@/types';
import { ReceiptView } from '@/components/OrderConfirmation';

interface Props {
  open: boolean;
  onClose: () => void;
  initialToken?: string;
}

export function ReceiptLookup({ open, onClose, initialToken }: Props) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ order: Order; items: OrderItemRow[] } | null>(null);

  const doLookup = async (rawToken: string) => {
    const clean = rawToken.trim().toUpperCase();
    if (!clean) {
      setError('Please enter your order token.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrderByToken(clean);
      if (!data) {
        setError('No order found for that token. Please check and try again.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not look up your bill.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && initialToken) {
      setToken(initialToken);
      doLookup(initialToken);
    } else if (!open) {
      setToken('');
      setError(null);
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialToken]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !result) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLookup(token);
  };

  const handleClose = () => {
    setResult(null);
    setToken('');
    setError(null);
    onClose();
  };

  if (!open) return null;

  if (result) {
    return <ReceiptView order={result.order} items={result.items} onClose={handleClose} />;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="animate-scale-in relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="h-5 w-5 text-brand-600" strokeWidth={2.2} />
            <h2 className="font-display text-lg font-700 text-ink-900">View your bill</h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-ink-500">
            Enter the collection token from your order to view or print your bill.
          </p>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="e.g. SP-7F3K-92"
                  autoFocus
                  className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2.5 pl-9 pr-3 font-mono text-sm uppercase tracking-wider text-ink-900 outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-700 text-white shadow-pop transition-all hover:bg-brand-600 active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Find</>}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-5 rounded-xl bg-ink-50 px-4 py-3 text-xs text-ink-500">
            <p className="font-600 text-ink-700">Where&apos;s my token?</p>
            <p className="mt-1">
              Your token was shown when you confirmed your order. It looks like
              <span className="font-mono font-700"> SP-XXXX-NN</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
