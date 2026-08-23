import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Stamp from "../components/Stamp";
import ProductImageGallery from "../components/ProductImageGallery";
import RelatedProducts from "../components/RelatedProducts";
import ExpandableText from "../components/ExpandableText";
import { products as productsApi } from "../api/client";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    productsApi
      .get(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setSelectedSize(null);
        setSelectedColor(null);
        setQuantity(1);
        setAdded(false);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16">
        <p className="text-stone">Loading…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16">
        <p className="text-oxblood">
          Couldn't load this product{error ? `: ${error}` : "."}
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block text-sm hover:text-oxblood"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  const hasVariants = product.variants?.length > 0;
  const sizes = hasVariants
    ? [...new Set(product.variants.map((v) => v.size))]
    : [];
  const colorsForSize = hasVariants
    ? product.variants.filter((v) => v.size === selectedSize)
    : [];

  const selectedVariant = hasVariants
    ? product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor,
      )
    : null;

  const maxQuantity = hasVariants ? (selectedVariant?.stock ?? 0) : 10;
  const canAddToCart = hasVariants
    ? Boolean(selectedVariant) && maxQuantity > 0
    : true;

  function handleAddToCart() {
    if (!canAddToCart) return;
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      variant: hasVariants
        ? { size: selectedSize, color: selectedColor }
        : undefined,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 grid md:grid-cols-2 gap-12 min-w-0">
        <ProductImageGallery
          images={product.images}
          productName={product.name}
        />

        {/* Details */}
        <div className="min-w-0">
          {product.category && (
            <Stamp tone="stone" className="mb-4">
              {product.category}
            </Stamp>
          )}
          <h1 className="font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-2 font-mono text-lg text-oxblood">
            {formatPrice(product.price)}
          </p>
          <ExpandableText
            text={product.description}
            limit={220}
            className="mt-6 text-stone"
          />

          {product.features?.length > 0 && (
            <ul className="mt-6 space-y-1 text-sm text-ink/80 list-disc list-inside">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}

          {hasVariants && (
            <div className="mt-8">
              <div className="stamp text-ink mb-3">Size</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSelectedColor(null);
                      setQuantity(1);
                    }}
                    className={`px-4 py-2 border font-mono text-xs ${
                      selectedSize === size
                        ? "border-oxblood text-oxblood"
                        : "border-stone-line hover:border-ink"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {selectedSize && (
                <>
                  <div className="stamp text-ink mb-3 mt-6">Color</div>
                  <div className="flex flex-wrap gap-2">
                    {colorsForSize.map((v) => (
                      <button
                        key={v.color}
                        disabled={v.stock === 0}
                        onClick={() => {
                          setSelectedColor(v.color);
                          setQuantity(1);
                        }}
                        className={`px-4 py-2 border font-mono text-xs ${
                          v.stock === 0
                            ? "border-stone-line text-stone/50 cursor-not-allowed line-through"
                            : selectedColor === v.color
                              ? "border-oxblood text-oxblood"
                              : "border-stone-line hover:border-ink"
                        }`}
                      >
                        {v.color}
                        {v.stock === 0 ? " (out of stock)" : ""}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-stone-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-panel"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-mono text-sm">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    maxQuantity ? Math.min(maxQuantity, q + 1) : q + 1,
                  )
                }
                className="w-9 h-9 flex items-center justify-center hover:bg-panel"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`flex-1 px-6 py-3 font-mono text-xs uppercase tracking-stamp transition-colors ${
                canAddToCart
                  ? "bg-ink text-paper hover:bg-oxblood"
                  : "bg-panel text-stone cursor-not-allowed"
              }`}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>

          {hasVariants && !selectedVariant && (
            <p className="mt-3 text-xs text-stone">
              Select a size and color to continue.
            </p>
          )}
        </div>
      </div>

      <RelatedProducts
        currentProductId={product._id}
        category={product.category}
      />
    </div>
  );
}
