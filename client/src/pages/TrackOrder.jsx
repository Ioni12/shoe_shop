import { useState } from "react";
import { Link } from "react-router-dom";
import Stamp from "../components/Stamp";
import { orders as ordersApi } from "../api/client";
import { formatDate, formatPrice } from "../lib/format";

const STATUS_ORDER = ["New", "Confirmed", "In Delivery", "Delivered"];

function StatusTimeline({ statusHistory, currentStatus }) {
  const isCancelled = currentStatus === "Cancelled";

  // Build one row per known status, filled in if it appears in history.
  const rows = STATUS_ORDER.map((status) => {
    const entry = statusHistory.find((h) => h.status === status);
    return { status, entry };
  });

  return (
    <ol className="relative border-l border-stone-line pl-6 space-y-6 sm:space-y-8">
      {rows.map(({ status, entry }, i) => {
        const reached = Boolean(entry);
        const isCurrent = status === currentStatus;

        return (
          <li key={status} className="relative">
            <span
              className={`absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                reached
                  ? isCurrent
                    ? "bg-oxblood border-oxblood"
                    : "bg-ink border-ink"
                  : "bg-paper border-stone-line"
              }`}
            />
            <div
              className={`font-mono text-xs uppercase tracking-stamp ${
                reached ? "text-ink" : "text-stone"
              } ${isCurrent ? "text-oxblood" : ""}`}
            >
              {status}
              {isCurrent && (
                <span className="ml-2 normal-case tracking-normal text-[10px] border border-oxblood text-oxblood px-1.5 py-0.5 align-middle">
                  Current
                </span>
              )}
            </div>
            {entry && (
              <div className="text-stone text-xs sm:text-sm mt-1">
                {formatDate(entry.changedAt)}
              </div>
            )}
          </li>
        );
      })}

      {isCancelled && (
        <li className="relative">
          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-oxblood border-oxblood" />
          <div className="font-mono text-xs uppercase tracking-stamp text-oxblood">
            Cancelled
            <span className="ml-2 normal-case tracking-normal text-[10px] border border-oxblood text-oxblood px-1.5 py-0.5 align-middle">
              Current
            </span>
          </div>
          {(() => {
            const entry = statusHistory.find((h) => h.status === "Cancelled");
            return entry ? (
              <div className="text-stone text-xs sm:text-sm mt-1">
                {formatDate(entry.changedAt)}
              </div>
            ) : null;
          })()}
        </li>
      )}
    </ol>
  );
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    setLoading(true);
    setNotFound(false);
    setError(null);
    setOrder(null);

    try {
      const data = await ordersApi.track(trimmed);
      setOrder(data);
    } catch (err) {
      if (err.message?.includes("404") || /not found/i.test(err.message)) {
        setNotFound(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
      <Stamp tone="oxblood" className="mb-4 sm:mb-6">
        Track order
      </Stamp>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">
        Where's my order?
      </h1>
      <p className="text-stone text-sm sm:text-base leading-relaxed mb-8">
        Enter the order number you received at checkout, e.g.{" "}
        <span className="font-mono">ORD-0001</span>.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-10"
      >
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="ORD-0001"
          className="flex-1 border border-stone-line bg-paper px-4 py-3 text-sm font-mono"
          aria-label="Order number"
        />
        <button
          type="submit"
          disabled={loading || !orderNumber.trim()}
          className="px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Searching…" : "Track order"}
        </button>
      </form>

      {notFound && (
        <div className="border border-stone-line px-4 py-6 text-center">
          <p className="text-stone text-sm">
            No order found with that number. Double-check it and try again.
          </p>
        </div>
      )}

      {error && (
        <div className="border border-oxblood text-oxblood px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {order && (
        <div className="border border-stone-line p-5 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-8">
            <div>
              <div className="stamp text-ink mb-1">Order</div>
              <div className="font-mono text-lg">{order.orderNumber}</div>
            </div>
            <div className="text-right">
              <div className="stamp text-ink mb-1">Placed</div>
              <div className="text-stone text-sm">
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>

          <StatusTimeline
            statusHistory={order.statusHistory || []}
            currentStatus={order.status}
          />

          <div className="mt-10 pt-6 border-t border-stone-line">
            <div className="stamp text-ink mb-3">Items</div>
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <div className="text-ink">{item.name}</div>
                    {item.variant &&
                      (item.variant.size || item.variant.color) && (
                        <div className="text-stone text-xs">
                          {[item.variant.size, item.variant.color]
                            .filter(Boolean)
                            .join(" / ")}
                        </div>
                      )}
                    <div className="text-stone text-xs">
                      Qty {item.quantity}
                    </div>
                  </div>
                  <div className="text-ink font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-line font-mono text-sm">
              <span className="uppercase tracking-stamp text-stone">Total</span>
              <span className="text-ink text-base">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/contact"
          className="font-mono text-xs uppercase tracking-stamp text-stone hover:text-oxblood transition-colors"
        >
          Questions about your order? Contact us →
        </Link>
      </div>
    </div>
  );
}
