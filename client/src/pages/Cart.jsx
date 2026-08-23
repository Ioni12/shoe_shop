import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getImageUrl, formatPrice } from "../lib/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <p className="text-stone mb-8">Find something worth walking in.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl md:text-4xl mb-10">Your cart</h1>

      <div className="divide-y divide-stone-line border-y border-stone-line">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
            className="py-6 flex gap-5"
          >
            <div className="w-24 h-24 bg-panel flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="stamp text-ink text-[10px]">No image</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg">{item.name}</h3>
                  {item.variant && (
                    <p className="text-xs text-stone mt-1 font-mono uppercase tracking-stamp">
                      {item.variant.size ? `Size ${item.variant.size}` : ""}
                      {item.variant.size && item.variant.color ? " / " : ""}
                      {item.variant.color ?? ""}
                    </p>
                  )}
                </div>
                <span className="font-mono text-sm">
                  {formatPrice(item.price)}
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
                    aria-label="Decrease quantity"
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
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="font-mono text-xs uppercase tracking-stamp text-stone hover:text-oxblood"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-stamp text-stone">
          Total
        </span>
        <span className="font-display text-2xl">{formatPrice(total)}</span>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          to="/checkout"
          className="inline-flex items-center px-8 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
