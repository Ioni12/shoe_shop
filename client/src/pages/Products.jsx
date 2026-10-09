import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { products as productsApi } from "../api/client";
import ProductCard from "../components/ProductCard";
import { getImageUrl } from "../lib/format";
import { deriveCategoryThumbnails } from "../lib/categories";

export default function Products() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name-asc");

  useEffect(() => {
    document.title = `${t("products.title")} — Këpucë e Artë`;
  }, [t]);

  useEffect(() => {
    let cancelled = false;

    productsApi
      .list()
      .then((data) => {
        if (!cancelled) setProducts(data);
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
  }, []);

  const SORT_OPTIONS = [
    { value: "name-asc", label: t("products.sort.nameAsc") },
    { value: "price-asc", label: t("products.sort.priceAsc") },
    { value: "price-desc", label: t("products.sort.priceDesc") },
  ];

  // Derived from active/public products only — a category thumbnail here
  // will never come from a product hidden from the storefront.
  const categoryThumbs = useMemo(
    () => deriveCategoryThumbnails(products),
    [products],
  );

  const visibleProducts = useMemo(() => {
    let list = category
      ? products.filter((p) => p.category === category)
      : products;

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      // Sort by name in current language
      const nameA =
        typeof a.name === "object"
          ? a.name?.[i18n.language] || a.name?.sq || ""
          : a.name || "";
      const nameB =
        typeof b.name === "object"
          ? b.name?.[i18n.language] || b.name?.sq || ""
          : b.name || "";
      return nameA.localeCompare(nameB, i18n.language);
    });

    return list;
  }, [products, category, sort, i18n.language]);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl md:text-4xl">{t("products.title")}</h1>

        {!loading && !error && products.length > 0 && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label={t("products.sortProducts")}
            className="border border-stone-line bg-paper px-4 py-2 text-sm font-mono"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {!loading && !error && categoryThumbs.length > 0 && (
        <div
          className="flex flex-wrap gap-3 mb-10"
          role="radiogroup"
          aria-label={t("products.filterByCategory")}
        >
          <button
            onClick={() => setCategory("")}
            aria-checked={category === ""}
            role="radio"
            className={`px-4 py-2 border font-mono text-xs uppercase tracking-stamp transition-colors ${
              category === ""
                ? "border-oxblood text-oxblood"
                : "border-stone-line hover:border-ink"
            }`}
          >
            {t("products.allCategories")}
          </button>

          {categoryThumbs.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(c.name)}
              aria-checked={category === c.name}
              role="radio"
              className={`flex items-center gap-2 pl-1 pr-4 py-1 border transition-colors ${
                category === c.name
                  ? "border-oxblood text-oxblood"
                  : "border-stone-line hover:border-ink"
              }`}
            >
              <span className="w-8 h-8 bg-panel overflow-hidden flex-shrink-0">
                {c.image ? (
                  <img
                    src={getImageUrl(c.image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </span>
              <span className="font-mono text-xs uppercase tracking-stamp">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-stone">{t("products.loadingProducts")}</p>}

      {!loading && error && (
        <p className="text-oxblood">{t("products.errorLoading", { error })}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-stone">{t("products.noProducts")}</p>
      )}

      {!loading && !error && products.length > 0 && visibleProducts.length === 0 && (
        <p className="text-stone">{t("products.noMatch")}</p>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
          {visibleProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
