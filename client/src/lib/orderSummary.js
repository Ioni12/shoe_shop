import { formatPrice } from "./format";

// Builds a plain-text summary of an order, used for both
// "save to device" and "share to WhatsApp / native share".
export function buildOrderSummaryText(order) {
  const lines = [];

  lines.push(`Order ${order.orderNumber}`);
  lines.push("");

  for (const item of order.items) {
    const variantParts = [];
    if (item.variant?.size) variantParts.push(`Size ${item.variant.size}`);
    if (item.variant?.color) variantParts.push(item.variant.color);
    const variantText = variantParts.length
      ? ` (${variantParts.join(", ")})`
      : "";

    lines.push(
      `${item.quantity} x ${item.name}${variantText} — ${formatPrice(item.price * item.quantity)}`,
    );
  }

  lines.push("");
  lines.push(`Total: ${formatPrice(order.total)}`);
  lines.push(`Payment: ${order.paymentMethod || "Pay on Delivery"}`);

  return lines.join("\n");
}
