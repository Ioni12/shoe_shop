const API_HOST =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

export function getImageUrl(path) {
  if (!path) return "";
  return `${API_HOST}${path}`;
}

/**
 * Format a price in ALL (Albanian Lek).
 * Pass the current i18n.language so the number locale matches UI language.
 */
export function formatPrice(value, lang = "sq") {
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return "";
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "ALL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

/**
 * Format a date/time string.
 * Pass the current i18n.language so date locale matches UI language.
 */
export function formatDate(value, lang = "sq") {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
