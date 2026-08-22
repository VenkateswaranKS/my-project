import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  CheckCheck,
  Printer,
  Clock,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import type { Order, OrderItemRow } from '@/types';
import { formatPrice } from '@/lib/format';
import { ReceiptHeader } from '@/components/ReceiptHeader';

interface Props {
  order: Order;
  items: OrderItemRow[];
  onClose: () => void;
}

function TokenBadge({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={copy}
      className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-left transition-colors hover:border-brand-500 hover:bg-brand-100"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-600 uppercase tracking-wider text-brand-700">
          Collection token
        </p>
        <p className="font-display text-2xl font-700 tracking-wider text-ink-900">
          {token}
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-700 text-brand-700 shadow-sm">
        {copied ? (
          <>
            <CheckCheck className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </span>
    </button>
  );
}

export function OrderConfirmation({ order, items, onClose }: Props) {
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const placedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (showReceipt) {
    return (
      <ReceiptView
        order={order}
        items={items}
        onBack={() => setShowReceipt(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="animate-scale-in relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-emerald-50 to-white px-6 pb-5 pt-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Check className="h-7 w-7" strokeWidth={3} />
          </div>
          <div>
            <h2 className="font-display text-xl font-700 text-ink-900">Order confirmed!</h2>
            <p className="mt-0.5 text-sm text-ink-500">
              Show this token at the counter to collect your food.
            </p>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <TokenBadge token={order.token} />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2.5">
              <Clock className="h-4 w-4 shrink-0 text-ink-500" />
              <div className="min-w-0">
                <p className="text-[11px] font-600 uppercase tracking-wider text-ink-400">
                  Placed
                </p>
                <p className="truncate text-sm font-600 text-ink-800">{placedTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-ink-500" />
              <div className="min-w-0">
                <p className="text-[11px] font-600 uppercase tracking-wider text-ink-400">
                  Status
                </p>
                <p className="truncate text-sm font-600 capitalize text-ink-800">
                  {order.status}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-ink-100">
            {items.map((it, i) => (
              <div
                key={it.id}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm ${
                  i > 0 ? 'border-t border-ink-100' : ''
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-100 text-xs font-700 text-brand-700">
                    {it.quantity}
                  </span>
                  <span className="truncate font-500 text-ink-800">{it.name}</span>
                </div>
                <span className="shrink-0 font-600 tabular-nums text-ink-700">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-ink-200 bg-ink-50 px-3.5 py-3">
              <span className="font-display font-700 text-ink-900">Total</span>
              <span className="font-display text-lg font-700 tabular-nums text-brand-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-brand-50 px-3.5 py-3 text-sm text-brand-900">
            <p>
              You can view or print your full bill anytime from the
              <span className="font-700"> &ldquo;View Bill&rdquo; </span>
              button on the main page — just enter your token.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-ink-100 p-4">
          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-ink-100 px-5 py-3 text-sm font-700 text-ink-800 transition-all hover:bg-ink-200 active:scale-[0.98]"
          >
            <Printer className="h-4 w-4" /> View Bill
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-700 text-white transition-all hover:bg-ink-800 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReceiptView({
  order,
  items,
  onBack,
  onClose,
}: {
  order: Order;
  items: OrderItemRow[];
  onBack?: () => void;
  onClose: () => void;
}) {
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const placedAt = new Date(order.created_at);
  const placedDate = placedAt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const placedTime = placedAt.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="animate-scale-in relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-5 py-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-600 text-ink-500 transition-colors hover:text-ink-900"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="font-display text-lg font-700 text-ink-900">Your Bill</span>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-700 text-brand-700 transition-colors hover:bg-brand-100"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <div id="receipt-print-area" className="mx-auto max-w-sm bg-white p-6 text-ink-900">
            <ReceiptHeader />

            <div className="mt-5 flex items-center justify-between border-y border-dashed border-ink-300 py-3">
              <div>
                <p className="text-[10px] font-600 uppercase tracking-wider text-ink-500">
                  Token No.
                </p>
                <p className="font-display text-lg font-700 tracking-wider text-ink-900">
                  {order.token}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-600 uppercase tracking-wider text-ink-500">
                  Order ID
                </p>
                <p className="font-mono text-xs text-ink-700">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>{placedDate}</span>
              <span>{placedTime}</span>
            </div>

            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-[10px] font-700 uppercase tracking-wider text-ink-500">
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Amt</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-dashed border-ink-100 align-top">
                    <td className="py-2 pr-2 text-sm font-600 text-ink-900">{it.name}</td>
                    <td className="py-2 text-center text-sm tabular-nums text-ink-700">
                      {it.quantity}
                    </td>
                    <td className="py-2 text-right text-sm tabular-nums text-ink-700">
                      {formatPrice(it.price)}
                    </td>
                    <td className="py-2 text-right text-sm font-600 tabular-nums text-ink-900">
                      {formatPrice(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-ink-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-600">
                <span>Service charge</span>
                <span className="tabular-nums">Free</span>
              </div>
              <div className="flex items-center justify-between text-ink-600">
                <span>GST (incl.)</span>
                <span className="tabular-nums">{formatPrice(0)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t-2 border-ink-900 pt-3">
                <span className="font-display text-base font-700 text-ink-900">TOTAL</span>
                <span className="font-display text-xl font-700 tabular-nums text-ink-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-dashed border-ink-300 pt-4 text-center">
              <p className="text-sm font-700 text-ink-900">Thank you!</p>
              <p className="mt-1 text-xs text-ink-500">
                Show your token at the SnackPass counter to collect your order.
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-wider text-ink-400">
                This is a computer-generated bill
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-100 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-ink-900 px-5 py-3 text-base font-700 text-white transition-all hover:bg-ink-800 active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
