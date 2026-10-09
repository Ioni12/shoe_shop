import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products as productsApi } from "../../api/client";
import { getImageUrl, formatPrice } from "../../lib/format";
import Stamp from "../../components/Stamp";

export default function ProductsAdmin() {
  const { t, i18n } = useTranslation();
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

  function resolveProductName(p) {
    if (typeof p.name === "object") {
      return p.name?.[i18n.language] || p.name?.sq || "";
    }
    return p.name || "";
  }

  async function handleDelete(id, rawName) {
    const displayName = typeof rawName === "object"
      ? rawName?.[i18n.language] || rawName?.sq || ""
      : rawName || "";
    if (!window.confirm(t("admin.products.confirmDelete", { name: displayName }))) return;
    setDeletingId(id);
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      const code = err.code;
      alert(
        t("admin.products.deleteError", {
          error: code
            ? t(`errors.${code}`, { defaultValue: err.message })
            : err.message,
        }),
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl md:text-3xl">{t("admin.products.title")}</h1>
        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          {t("admin.products.newProduct")}
        </Link>
      </div>

      {loading && <p className="text-stone">{t("admin.products.loading")}</p>}
      {!loading && error && (
        <p className="text-oxblood">{t("admin.products.errorLoading", { error })}</p>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-stone">{t("admin.products.noProducts")}</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="divide-y divide-stone-line border-y border-stone-line">
          {products.map((p) => {
            const name = resolveProductName(p);
            return (
              <div key={p._id} className="py-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-panel flex-shrink-0 overflow-hidden">
                  {p.images?.[0] ? (
                    <img
                      src={getImageUrl(p.images[0])}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg truncate">{name}</p>
                  <p className="text-xs text-stone font-mono">
                    {p.category || t("admin.products.uncategorized")}
                  </p>
                </div>

                <span className="font-mono text-sm">
                  {formatPrice(p.price, i18n.language)}
                </span>

                <Stamp tone={p.isActive ? "ink" : "stone"}>
                  {p.isActive ? t("admin.products.active") : t("admin.products.inactive")}
                </Stamp>

                <Link
                  to={`/admin/products/${p._id}/edit`}
                  className="font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
                >
                  {t("admin.products.edit")}
                </Link>

                <button
                  onClick={() => handleDelete(p._id, p.name)}
                  disabled={deletingId === p._id}
                  className="font-mono text-xs uppercase tracking-stamp text-stone hover:text-oxblood disabled:opacity-50"
                >
                  {deletingId === p._id
                    ? t("admin.products.deleting")
                    : t("admin.products.delete")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
