import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "msole_cart";

function lineKey(productId, variant) {
  return `${productId}::${variant ? `${variant.size ?? ""}-${variant.color ?? ""}` : ""}`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem({ productId, name, price, image, variant, quantity = 1 }) {
    setItems((prev) => {
      const key = lineKey(productId, variant);
      const existing = prev.find(
        (i) => lineKey(i.productId, i.variant) === key,
      );
      if (existing) {
        return prev.map((i) =>
          lineKey(i.productId, i.variant) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, name, price, image, variant, quantity }];
    });
  }

  function removeItem(productId, variant) {
    const key = lineKey(productId, variant);
    setItems((prev) =>
      prev.filter((i) => lineKey(i.productId, i.variant) !== key),
    );
  }

  function updateQuantity(productId, variant, quantity) {
    const key = lineKey(productId, variant);
    setItems((prev) =>
      prev.map((i) =>
        lineKey(i.productId, i.variant) === key
          ? { ...i, quantity: Math.max(1, quantity) }
          : i,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
