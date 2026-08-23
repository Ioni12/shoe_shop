import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orders as ordersApi } from "../api/client";
import { formatPrice, getImageUrl } from "../lib/format";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

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

  if (items.length === 0) {
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
      });
      clearCart();
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8 py-16 grid md:grid-cols-[1.3fr,1fr] gap-16">
      {/* Form */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl mb-8">Checkout</h1>

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
                First name
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
                Last name
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
              Phone
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
              City
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
              Address
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
              Notes (optional)
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
            {submitting ? "Placing order…" : "Place order — pay on delivery"}
          </button>
        </form>
      </div>

      {/* Order summary */}
      <div>
        <div className="stamp text-ink mb-4">Order summary</div>
        <div className="divide-y divide-stone-line border-y border-stone-line">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
              className="py-4 flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-panel flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1 flex items-baseline justify-between text-sm">
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
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-stamp text-stone">
            Total
          </span>
          <span className="font-display text-2xl">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
