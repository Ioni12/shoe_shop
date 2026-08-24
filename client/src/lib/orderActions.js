import { buildOrderSummaryText } from "./orderSummary";

// Triggers a browser download of the order summary as a .txt file.
export function saveOrderToDevice(order) {
  const text = buildOrderSummaryText(order);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${order.orderNumber}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Shares the order summary via the native Web Share API when available
// (shows WhatsApp alongside other apps on supporting browsers/devices).
// Falls back to opening a wa.me link with the same text pre-filled.
// Returns true if something was actually offered to the user, false if
// neither path was available (extremely rare — very old desktop browser).
export async function shareOrder(order) {
  const text = buildOrderSummaryText(order);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Order ${order.orderNumber}`,
        text,
      });
      return true;
    } catch (err) {
      // User cancelled the share sheet — not an error, just stop.
      if (err.name === "AbortError") return true;
      // Any other failure: fall through to the wa.me fallback below.
    }
  }

  // Fallback: wa.me works everywhere, including desktop, opens WhatsApp
  // (app or web) with the text pre-filled in a new chat.
  const encoded = encodeURIComponent(text);
  const waUrl = `https://wa.me/?text=${encoded}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
  return true;
}
