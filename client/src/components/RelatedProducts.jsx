import { useEffect, useState } from "react";
import { products as productsApi } from "../api/client";
import ProductCard from "./ProductCard";

const TARGET_COUNT = 4;

export default function RelatedProducts({ currentProductId, category }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    productsApi
      .list()
      .then((all) => {
        if (cancelled) return;
        const others = all.filter((p) => p._id !== currentProductId);

        const sameCategory = category
          ? others.filter((p) => p.category === category)
          : [];

        let picks = sameCategory.slice(0, TARGET_COUNT);

        if (picks.length < TARGET_COUNT) {
          const pickedIds = new Set(picks.map((p) => p._id));
          const remainder = others
            .filter((p) => !pickedIds.has(p._id))
            .sort(() => Math.random() - 0.5);
          picks = [
            ...picks,
            ...remainder.slice(0, TARGET_COUNT - picks.length),
          ];
        }

        setRelated(picks);
      })
      .catch(() => {
        // quiet failure — related section just doesn't render
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentProductId, category]);

  if (loading || related.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 border-t border-stone-line">
      <h2 className="font-display text-2xl md:text-3xl mb-10">
        You might also like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {related.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
