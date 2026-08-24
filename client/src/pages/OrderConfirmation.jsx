import { Link, useLocation } from "react-router-dom";
import Stamp from "../components/Stamp";
import { formatPrice } from "../lib/format";
import { saveOrderToDevice, shareOrder } from "../lib/orderActions";

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">No order to show</h1>
        <p className="text-stone mb-8">
          This page only shows an order right after checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  function handleSave() {
    saveOrderToDevice(order);
  }

  async function handleShare() {
    await shareOrder(order);
  }

  return (
    <div className="mx-auto max-w-xl px-5 md:px-8 py-24">
      <div className="text-center mb-10">
        <Stamp tone="oxblood" className="mb-4">
          Order confirmed
        </Stamp>
        <h1 className="font-display text-3xl md:text-4xl">
          {order.orderNumber}
        </h1>
        <p className="text-stone mt-3">
          Thanks, {order.customer?.firstName} — we'll be in touch to arrange
          delivery. Pay on delivery, nothing due now.
        </p>
      </div>

      <div className="divide-y divide-stone-line border-y border-stone-line">
        {order.items?.map((item, i) => (
          <div
            key={i}
            className="py-4 flex items-baseline justify-between text-sm"
          >
            <div>
              <p>{item.name}</p>
              {item.variant && (
                <p className="text-xs text-stone font-mono uppercase tracking-stamp mt-0.5">
                  {item.variant.size ? `Size ${item.variant.size}` : ""}
                  {item.variant.size && item.variant.color ? " / " : ""}
                  {item.variant.color ?? ""} × {item.quantity}
                </p>
              )}
            </div>
            <span className="font-mono">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-stamp text-stone">
          Total
        </span>
        <span className="font-display text-2xl">
          {formatPrice(order.total)}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-stamp hover:bg-ink hover:text-paper transition-colors"
        >
          Save to device
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="px-4 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-stamp hover:bg-ink hover:text-paper transition-colors"
        >
          Send to WhatsApp
        </button>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/products"
          className="font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
        >
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
