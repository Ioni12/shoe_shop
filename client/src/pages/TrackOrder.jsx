import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Stamp from "../components/Stamp";
import { orders as ordersApi } from "../api/client";
import { formatDate, formatPrice } from "../lib/format";

function StatusTimeline({ statusHistory, currentStatus, t, lang }) {
  const STATUS_ORDER = ["New", "Confirmed", "In Delivery", "Delivered"];
  const isCancelled = currentStatus === "Cancelled";

  // Build one row per known status, filled in if it appears in history.
  const rows = STATUS_ORDER.map((status) => {
    const entry = statusHistory.find((h) => h.status === status);
    return { status, entry };
  });

  return (
    <ol className="relative border-l border-stone-line pl-6 space-y-6 sm:space-y-8">
      {rows.map(({ status, entry }) => {
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
              {t(`orderStatus.${status}`)}
              {isCurrent && (
                <span className="ml-2 normal-case tracking-normal text-[10px] border border-oxblood text-oxblood px-1.5 py-0.5 align-middle">
                  {t("trackOrder.current")}
                </span>
              )}
            </div>
            {entry && (
              <div className="text-stone text-xs sm:text-sm mt-1">
                {formatDate(entry.changedAt, lang)}
              </div>
            )}
          </li>
        );
      })}

      {isCancelled && (
        <li className="relative">
          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-oxblood border-oxblood" />
          <div className="font-mono text-xs uppercase tracking-stamp text-oxblood">
            {t("orderStatus.Cancelled")}
            <span className="ml-2 normal-case tracking-normal text-[10px] border border-oxblood text-oxblood px-1.5 py-0.5 align-middle">
              {t("trackOrder.current")}
            </span>
          </div>
          {(() => {
            const entry = statusHistory.find((h) => h.status === "Cancelled");
            return entry ? (
              <div className="text-stone text-xs sm:text-sm mt-1">
                {formatDate(entry.changedAt, lang)}
              </div>
            ) : null;
          })()}
        </li>
      )}
    </ol>
  );
}

export default function TrackOrder() {
  const { t, i18n } = useTranslation();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `${t("trackOrder.title")} — Këpucë e Artë`;
  }, [t]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    const trimmedPhone = phone.trim();
    if (!trimmed || !trimmedPhone) return;

    setLoading(true);
    setNotFound(false);
    setError(null);
    setOrder(null);

    try {
      const data = await ordersApi.track(trimmed, trimmedPhone);
      setOrder(data);
    } catch (err) {
      // Backend returns "No order found" for both unknown number and wrong phone.
      if (/no order found|not found/i.test(err.message || "")) {
        setNotFound(true);
      } else {
        const code = err.code;
        setError(
          code ? t(`errors.${code}`, { defaultValue: err.message }) : err.message,
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function resolveItemName(item) {
    if (typeof item.name === "object") {
      return item.name?.[i18n.language] || item.name?.sq || "";
    }
    return item.name || "";
  }

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
      <Stamp tone="oxblood" className="mb-4 sm:mb-6">
        {t("trackOrder.stamp")}
      </Stamp>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">
        {t("trackOrder.title")}
      </h1>
      <p className="text-stone text-sm sm:text-base leading-relaxed mb-8">
        {t("trackOrder.subtitle")
          .split("<mono>")
          .flatMap((part, i) => {
            if (i === 0) return [part];
            const [mono, rest] = part.split("</mono>");
            return [
              <span key={i} className="font-mono">
                {mono}
              </span>,
              rest,
            ];
          })}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-10">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder={t("trackOrder.orderNumberPlaceholder")}
          className="border border-stone-line bg-paper px-4 py-3 text-sm font-mono"
          aria-label={t("trackOrder.orderNumberLabel")}
          autoComplete="off"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("trackOrder.phonePlaceholder")}
            className="flex-1 border border-stone-line bg-paper px-4 py-3 text-sm font-mono"
            aria-label={t("trackOrder.phoneLabel")}
            autoComplete="tel"
          />
          <button
            type="submit"
            disabled={loading || !orderNumber.trim() || !phone.trim()}
            className="px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? t("trackOrder.searching") : t("trackOrder.trackButton")}
          </button>
        </div>
      </form>

      {notFound && (
        <div className="border border-stone-line px-4 py-6 text-center">
          <p className="text-stone text-sm">{t("trackOrder.notFoundMessage")}</p>
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
              <div className="stamp text-ink mb-1">{t("trackOrder.orderLabel")}</div>
              <div className="font-mono text-lg">{order.orderNumber}</div>
            </div>
            <div className="text-right">
              <div className="stamp text-ink mb-1">{t("trackOrder.placedLabel")}</div>
              <div className="text-stone text-sm">
                {formatDate(order.createdAt, i18n.language)}
              </div>
            </div>
          </div>

          <StatusTimeline
            statusHistory={order.statusHistory || []}
            currentStatus={order.status}
            t={t}
            lang={i18n.language}
          />

          <div className="mt-10 pt-6 border-t border-stone-line">
            <div className="stamp text-ink mb-3">{t("trackOrder.itemsLabel")}</div>
            <ul className="space-y-3">
              {order.items.map((item, i) => {
                const name = resolveItemName(item);
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <div className="text-ink">{name}</div>
                      {item.variant &&
                        (item.variant.size || item.variant.color) && (
                          <div className="text-stone text-xs">
                            {[item.variant.size, item.variant.color]
                              .filter(Boolean)
                              .join(" / ")}
                          </div>
                        )}
                      <div className="text-stone text-xs">
                        {t("trackOrder.qtyLabel", { qty: item.quantity })}
                      </div>
                    </div>
                    <div className="text-ink font-mono">
                      {formatPrice(item.price * item.quantity, i18n.language)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-line font-mono text-sm">
              <span className="uppercase tracking-stamp text-stone">
                {t("common.total")}
              </span>
              <span className="text-ink text-base">
                {formatPrice(order.total, i18n.language)}
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
          {t("trackOrder.contact")}
        </Link>
      </div>
    </div>
  );
}
