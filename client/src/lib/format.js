const API_HOST =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

export function getImageUrl(path) {
  if (!path) return "";
  return `${API_HOST}${path}`;
}

export function formatPrice(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return "";
  return `$${Number(value).toFixed(2)}`;
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
