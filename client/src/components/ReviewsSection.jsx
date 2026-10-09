import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { reviews as reviewsApi } from "../api/client";
import Stamp from "./Stamp";
import i18n from "../i18n";

function Stars({ value, size = "text-sm" }) {
  const { t } = useTranslation();
  return (
    <span
      className={`font-mono ${size} text-oxblood`}
      aria-label={t("reviews.starsLabel", { value })}
    >
      {"★".repeat(Math.round(value))}
      <span className="text-stone-line">
        {"★".repeat(5 - Math.round(value))}
      </span>
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-xl leading-none"
          aria-label={t("reviews.rateN", { n })}
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
  const { t } = useTranslation();
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
      setSubmitError(t("reviews.selectRating"));
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
      const code = err.code;
      setSubmitError(
        code ? t(`errors.${code}`, { defaultValue: err.message }) : err.message,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 border-t border-stone-line">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl md:text-3xl">{t("reviews.title")}</h2>
          {!loading && count > 0 && (
            <span className="flex items-center gap-2">
              <Stars value={averageRating} />
              <span className="text-sm text-stone">
                {t(count === 1 ? "reviews.averageLabel" : "reviews.averageLabel_other", {
                  avg: averageRating,
                  count,
                })}
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
            {t("reviews.writeReview")}
          </button>
        )}
      </div>

      {/* Collapsible form */}
      {formOpen && (
        <div className="mb-10 border border-stone-line p-6 sm:p-8 max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <Stamp tone="stone">{t("reviews.writeReview")}</Stamp>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setSubmitError(null);
              }}
              className="text-stone hover:text-oxblood text-sm"
              aria-label={t("reviews.closeForm")}
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
                {t("reviews.nameLabel")}
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
              <span className="stamp text-ink mb-1.5 inline-block">
                {t("reviews.ratingLabel")}
              </span>
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
                {t("reviews.commentLabel")}
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
              {submitting ? t("reviews.submitting") : t("reviews.submitReview")}
            </button>
          </form>
        </div>
      )}

      {submitted && !formOpen && (
        <p className="mb-8 text-sm text-stone">{t("reviews.thankYou")}</p>
      )}

      {/* List */}
      {loading && <p className="text-stone">{t("reviews.loading")}</p>}
      {!loading && error && (
        <p className="text-oxblood">{t("reviews.errorLoading", { error })}</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-stone">{t("reviews.noReviews")}</p>
      )}
      {!loading && !error && reviews.length > 0 && (
        <ul className="divide-y divide-stone-line border-t border-stone-line">
          {reviews.map((r) => (
            <li key={r._id} className="py-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-sm font-medium">{r.reviewerName}</span>
                <span className="text-xs text-stone font-mono">
                  {new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(
                    new Date(r.createdAt),
                  )}
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
