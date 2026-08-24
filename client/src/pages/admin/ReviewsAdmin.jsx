import { useEffect, useState } from "react";
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

  async function handleDelete(review) {
    const confirmed = window.confirm(
      `Delete this review by ${review.reviewerName}? This can't be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(review._id);
    try {
      await reviewsApi.remove(review._id);
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      alert(`Couldn't delete review: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <h1 className="font-display text-2xl md:text-3xl mb-8">Reviews</h1>

      {loading && <p className="text-stone">Loading…</p>}
      {!loading && error && (
        <p className="text-oxblood">Couldn't load reviews: {error}</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-stone">No reviews yet.</p>
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
                  {r.product?.name ?? "Deleted product"}
                </span>
              </div>

              {/* Review content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium">{r.reviewerName}</span>
                  <Stars value={r.rating} />
                  <span className="text-xs text-stone font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
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
                  {deletingId === r._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
