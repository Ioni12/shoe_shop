import { useEffect, useState } from "react";
import { reviews as reviewsApi } from "../api/client";
import Stamp from "./Stamp";

function Stars({ value, size = "text-sm" }) {
  return (
    <span
      className={`font-mono ${size} text-oxblood`}
      aria-label={`${value} out of 5 stars`}
    >
      {"★".repeat(Math.round(value))}
      <span className="text-stone-line">
        {"★".repeat(5 - Math.round(value))}
      </span>
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-xl leading-none"
          aria-label={`Rate ${n} out of 5`}
        >
          <span className={n <= value ? "text-oxblood" : "text-stone-line"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    reviewerName: "",
    rating: 0,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    reviewsApi
      .list(productId)
      .then((data) => {
        if (cancelled) return;
        setReviews(data.reviews);
        setCount(data.count);
        setAverageRating(data.averageRating);
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
  }, [productId]);

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.rating) {
      setSubmitError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    try {
      const newReview = await reviewsApi.create(productId, {
        reviewerName: form.reviewerName,
        rating: form.rating,
        comment: form.comment,
      });

      const nextReviews = [newReview, ...reviews];
      const nextCount = count + 1;
      const nextAverage =
        Math.round(((averageRating * count + form.rating) / nextCount) * 10) /
        10;

      setReviews(nextReviews);
      setCount(nextCount);
      setAverageRating(nextAverage);
      setForm({ reviewerName: "", rating: 0, comment: "" });
      setSubmitted(true);
      setFormOpen(false);
      setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 border-t border-stone-line">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl md:text-3xl">Reviews</h2>
          {!loading && count > 0 && (
            <span className="flex items-center gap-2">
              <Stars value={averageRating} />
              <span className="text-sm text-stone">
                {averageRating} ({count} {count === 1 ? "review" : "reviews"})
              </span>
            </span>
          )}
        </div>

        {!formOpen && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="px-5 py-2.5 border border-ink font-mono text-xs uppercase tracking-stamp hover:bg-ink hover:text-paper transition-colors"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Collapsible form */}
      {formOpen && (
        <div className="mb-10 border border-stone-line p-6 sm:p-8 max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <Stamp tone="stone">Write a review</Stamp>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setSubmitError(null);
              }}
              className="text-stone hover:text-oxblood text-sm"
              aria-label="Close review form"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reviewerName"
                className="stamp text-ink mb-1.5 inline-block"
              >
                Name
              </label>
              <input
                id="reviewerName"
                name="reviewerName"
                type="text"
                required
                maxLength={80}
                value={form.reviewerName}
                onChange={handleFieldChange}
                className="w-full border border-stone-line bg-paper px-4 py-2.5 font-body text-sm"
              />
            </div>

            <div>
              <span className="stamp text-ink mb-1.5 inline-block">Rating</span>
              <StarPicker
                value={form.rating}
                onChange={(n) => setForm((f) => ({ ...f, rating: n }))}
              />
            </div>

            <div>
              <label
                htmlFor="comment"
                className="stamp text-ink mb-1.5 inline-block"
              >
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                maxLength={1000}
                value={form.comment}
                onChange={handleFieldChange}
                className="w-full border border-stone-line bg-paper px-4 py-2.5 font-body text-sm resize-none"
              />
            </div>

            {submitError && (
              <p className="text-sm text-oxblood">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </form>
        </div>
      )}

      {submitted && !formOpen && (
        <p className="mb-8 text-sm text-stone">
          Thanks — your review has been posted.
        </p>
      )}

      {/* List */}
      {loading && <p className="text-stone">Loading…</p>}
      {!loading && error && (
        <p className="text-oxblood">Couldn't load reviews: {error}</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-stone">No reviews yet — be the first.</p>
      )}
      {!loading && !error && reviews.length > 0 && (
        <ul className="divide-y divide-stone-line border-t border-stone-line">
          {reviews.map((r) => (
            <li key={r._id} className="py-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-sm font-medium">{r.reviewerName}</span>
                <span className="text-xs text-stone font-mono">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Stars value={r.rating} />
              {r.comment && (
                <p className="mt-2 text-sm text-stone">{r.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
