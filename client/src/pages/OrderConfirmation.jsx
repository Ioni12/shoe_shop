import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Stamp from "../components/Stamp";
import { formatPrice } from "../lib/format";
import { saveOrderToDevice, shareOrder } from "../lib/orderActions";
import { saveOrderReceiptImage } from "../lib/orderReceiptImage";

export default function OrderConfirmation() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    document.title = `${t("orderConfirmation.stamp")} — Këpucë e Artë`;
  }, [t]);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">{t("orderConfirmation.noOrder")}</h1>
        <p className="text-stone mb-8">{t("orderConfirmation.noOrderMessage")}</p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          {t("orderConfirmation.shopCollection")}
        </Link>
      </div>
    );
  }

  function handleSave() {
    saveOrderToDevice(order);
  }

  function handleSaveImage() {
    saveOrderReceiptImage(order);
  }

  async function handleShare() {
    await shareOrder(order);
  }

  // Resolve item name from the order snapshot (backend stores name at time of order)
  function resolveItemName(item) {
    if (typeof item.name === "object") {
      return item.name?.[i18n.language] || item.name?.sq || "";
    }
    return item.name || "";
  }

  return (
    <div className="mx-auto max-w-xl px-5 md:px-8 py-24">
      <div className="text-center mb-10">
        <Stamp tone="oxblood" className="mb-4">
          {t("orderConfirmation.stamp")}
        </Stamp>
        <h1 className="font-display text-3xl md:text-4xl">
          {order.orderNumber}
        </h1>
        <p className="text-stone mt-3">
          {t("orderConfirmation.thankYou", {
            name: order.customer?.firstName,
          })}
        </p>
      </div>

      <div className="divide-y divide-stone-line border-y border-stone-line">
        {order.items?.map((item, i) => {
          const name = resolveItemName(item);
          return (
            <div
              key={i}
              className="py-4 flex items-baseline justify-between text-sm"
            >
              <div>
                <p>{name}</p>
                {item.variant && (
                  <p className="text-xs text-stone font-mono uppercase tracking-stamp mt-0.5">
                    {item.variant.size
                      ? t("orderConfirmation.sizeLabel", { size: item.variant.size })
                      : ""}
                    {item.variant.size && item.variant.color ? " / " : ""}
                    {item.variant.color ?? ""} × {item.quantity}
                  </p>
                )}
              </div>
              <span className="font-mono">
                {formatPrice(item.price * item.quantity, i18n.language)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-stamp text-stone">
          {t("common.total")}
        </span>
        <span className="font-display text-2xl">
          {formatPrice(order.total, i18n.language)}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-stamp hover:bg-ink hover:text-paper transition-colors"
        >
          {t("orderConfirmation.saveAsText")}
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          className="px-4 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-stamp hover:bg-ink hover:text-paper transition-colors"
        >
          {t("orderConfirmation.saveAsImage")}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="px-4 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-stamp hover:bg-ink hover:text-paper transition-colors"
        >
          {t("orderConfirmation.sendToWhatsApp")}
        </button>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/products"
          className="font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
        >
          {t("orderConfirmation.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
