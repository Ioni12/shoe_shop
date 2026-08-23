import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { products as productsApi } from "../../api/client";
import { getImageUrl, formatPrice } from "../../lib/format";
import Stamp from "../../components/Stamp";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    productsApi
      .listAll()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Couldn't delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl md:text-3xl">Products</h1>
        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          + New product
        </Link>
      </div>

      {loading && <p className="text-stone">Loading…</p>}
      {!loading && error && (
        <p className="text-oxblood">Couldn't load products: {error}</p>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-stone">No products yet.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="divide-y divide-stone-line border-y border-stone-line">
          {products.map((p) => (
            <div key={p._id} className="py-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-panel flex-shrink-0 overflow-hidden">
                {p.images?.[0] ? (
                  <img
                    src={getImageUrl(p.images[0])}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display text-lg truncate">{p.name}</p>
                <p className="text-xs text-stone font-mono">
                  {p.category || "Uncategorized"}
                </p>
              </div>

              <span className="font-mono text-sm">{formatPrice(p.price)}</span>

              <Stamp tone={p.isActive ? "ink" : "stone"}>
                {p.isActive ? "Active" : "Inactive"}
              </Stamp>

              <Link
                to={`/admin/products/${p._id}/edit`}
                className="font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(p._id, p.name)}
                disabled={deletingId === p._id}
                className="font-mono text-xs uppercase tracking-stamp text-stone hover:text-oxblood disabled:opacity-50"
              >
                {deletingId === p._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
