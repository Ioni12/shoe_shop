import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { orders as ordersApi } from "../api/client";
import { formatPrice, getImageUrl } from "../lib/format";
import { products as productsApi } from "../api/client";

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [productMap, setProductMap] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    document.title = `${t("checkout.title")} — Këpucë e Artë`;
  }, [t]);

  // Fetch product data to resolve localised names for the order summary
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

  function resolveProductName(item) {
    const product = productMap[item.productId];
    if (!product) return "…";
    if (typeof product.name === "object") {
      return product.name?.[i18n.language] || product.name?.sq || "";
    }
    return product.name || "";
  }

  // Once an order has been successfully placed, never redirect to /cart
  // again for the rest of this component's life.
  if (items.length === 0 && !orderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const order = await ordersApi.create({
        customer: form,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          variant: i.variant,
        })),
        lang: i18n.language,
      });

      setOrderPlaced(true);
      navigate("/order-confirmation", { state: { order } });
      clearCart();
    } catch (err) {
      const code = err.code;
      setError(
        code ? t(`errors.${code}`, { defaultValue: err.message }) : err.message,
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8 py-16 grid md:grid-cols-[1.3fr,1fr] gap-16">
      {/* Form */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl mb-8">{t("checkout.title")}</h1>

        {error && (
          <div className="mb-6 border border-oxblood text-oxblood px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="stamp text-ink mb-2 inline-block"
              >
                {t("checkout.firstName")}
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="stamp text-ink mb-2 inline-block"
              >
                {t("checkout.lastName")}
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="stamp text-ink mb-2 inline-block">
              {t("checkout.phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
            />
          </div>

          <div>
            <label htmlFor="city" className="stamp text-ink mb-2 inline-block">
              {t("checkout.city")}
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="stamp text-ink mb-2 inline-block"
            >
              {t("checkout.address")}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm"
            />
          </div>

          <div>
            <label htmlFor="notes" className="stamp text-ink mb-2 inline-block">
              {t("checkout.notes")}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="w-full border border-stone-line bg-paper px-4 py-3 font-body text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors disabled:opacity-50"
          >
            {submitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
          </button>
        </form>
      </div>

      {/* Order summary */}
      <div>
        <div className="stamp text-ink mb-4">{t("checkout.orderSummary")}</div>
        <div className="divide-y divide-stone-line border-y border-stone-line">
          {items.map((item) => {
            const name = resolveProductName(item);
            return (
              <div
                key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
                className="py-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-panel flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 flex items-baseline justify-between text-sm">
                  <div>
                    <p>{name}</p>
                    {item.variant && (
                      <p className="text-xs text-stone font-mono uppercase tracking-stamp mt-0.5">
                        {item.variant.size
                          ? t("checkout.sizeLabel", { size: item.variant.size })
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
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-stamp text-stone">
            {t("common.total")}
          </span>
          <span className="font-display text-2xl">{formatPrice(total, i18n.language)}</span>
        </div>
      </div>
    </div>
  );
}
