import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { getImageUrl, formatPrice } from "../lib/format";
import { products as productsApi } from "../api/client";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { items, updateQuantity, removeItem, total } = useCart();
  const [productMap, setProductMap] = useState({});

  // Fetch product data to resolve localised names
  useEffect(() => {
    if (items.length === 0) return;
    const ids = [...new Set(items.map((i) => i.productId))];
    Promise.all(ids.map((id) => productsApi.get(id).catch(() => null))).then(
      (results) => {
        const map = {};
        results.forEach((p) => {
          if (p) map[p._id] = p;
        });
        setProductMap(map);
      },
    );
  }, [items.length]);

  useEffect(() => {
    document.title = `${t("cart.title")} — Këpucë e Artë`;
  }, [t]);

  function resolveProductName(item) {
    const product = productMap[item.productId];
    if (!product) return "…";
    if (typeof product.name === "object") {
      return product.name?.[i18n.language] || product.name?.sq || "";
    }
    return product.name || "";
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">{t("cart.emptyTitle")}</h1>
        <p className="text-stone mb-8">{t("cart.emptyMessage")}</p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          {t("cart.shopCollection")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl md:text-4xl mb-10">{t("cart.title")}</h1>

      <div className="divide-y divide-stone-line border-y border-stone-line">
        {items.map((item) => {
          const name = resolveProductName(item);
          return (
            <div
              key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
              className="py-6 flex gap-5"
            >
              <div className="w-24 h-24 bg-panel flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="stamp text-ink text-[10px]">{t("cart.noImage")}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg">{name}</h3>
                    {item.variant && (
                      <p className="text-xs text-stone mt-1 font-mono uppercase tracking-stamp">
                        {item.variant.size
                          ? t("cart.sizeLabel", { size: item.variant.size })
                          : ""}
                        {item.variant.size && item.variant.color ? " / " : ""}
                        {item.variant.color ?? ""}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-sm">
                    {formatPrice(item.price, i18n.language)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-stone-line">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variant,
                          item.quantity - 1,
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-panel"
                      aria-label={t("cart.decreaseQty")}
                    >
                      −
                    </button>
                    <span className="w-9 text-center font-mono text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variant,
                          item.quantity + 1,
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-panel"
                      aria-label={t("cart.increaseQty")}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variant)}
                    className="font-mono text-xs uppercase tracking-stamp text-stone hover:text-oxblood"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-stamp text-stone">
          {t("common.total")}
        </span>
        <span className="font-display text-2xl">{formatPrice(total, i18n.language)}</span>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          to="/checkout"
          className="inline-flex items-center px-8 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          {t("cart.checkout")}
        </Link>
      </div>
    </div>
  );
}
