import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { reviews as reviewsApi } from "../../api/client";
import Stamp from "../../components/Stamp";

const API_HOST = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

function Stars({ value }) {
  return (
    <span className="font-mono text-sm text-oxblood">
      {"★".repeat(Math.round(value))}
      <span className="text-stone-line">
        {"★".repeat(5 - Math.round(value))}
      </span>
    </span>
  );
}

export default function ReviewsAdmin() {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    setError(null);
    reviewsApi
      .listAll()
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function resolveProductName(product) {
    if (!product) return t("admin.reviews.deletedProduct");
    if (typeof product.name === "object") {
      return product.name?.[i18n.language] || product.name?.sq || "";
    }
    return product.name || "";
  }

  async function handleDelete(review) {
    const confirmed = window.confirm(
      t("admin.reviews.confirmDelete", { name: review.reviewerName }),
    );
    if (!confirmed) return;

    setDeletingId(review._id);
    try {
      await reviewsApi.remove(review._id);
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      const code = err.code;
      alert(
        t("admin.reviews.deleteError", {
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
      <h1 className="font-display text-2xl md:text-3xl mb-8">{t("admin.reviews.title")}</h1>

      {loading && <p className="text-stone">{t("admin.reviews.loading")}</p>}
      {!loading && error && (
        <p className="text-oxblood">{t("admin.reviews.errorLoading", { error })}</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-stone">{t("admin.reviews.noReviews")}</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="divide-y divide-stone-line border-y border-stone-line">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="py-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4"
            >
              {/* Product */}
              <div className="flex items-center gap-3 md:w-48 shrink-0">
                {r.product?.images?.[0] && (
                  <img
                    src={`${API_HOST}${r.product.images[0]}`}
                    alt=""
                    className="w-10 h-10 object-cover shrink-0"
                  />
                )}
                <span className="text-sm truncate">
                  {resolveProductName(r.product)}
                </span>
              </div>

              {/* Review content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium">{r.reviewerName}</span>
                  <Stars value={r.rating} />
                  <span className="text-xs text-stone font-mono">
                    {new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(
                      new Date(r.createdAt),
                    )}
                  </span>
                </div>
                {r.comment && <p className="text-sm text-stone">{r.comment}</p>}
              </div>

              {/* Delete */}
              <div className="md:w-32 flex md:justify-end">
                <button
                  onClick={() => handleDelete(r)}
                  disabled={deletingId === r._id}
                  className="font-mono text-xs uppercase tracking-stamp text-oxblood hover:opacity-70 disabled:opacity-40"
                >
                  {deletingId === r._id
                    ? t("admin.reviews.deleting")
                    : t("admin.reviews.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
