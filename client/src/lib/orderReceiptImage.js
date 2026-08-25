import { formatPrice } from "./format";

// Renders an order receipt as a PNG and triggers a download.
// Pure Canvas 2D drawing — no external libraries, no server round-trip.

const WIDTH = 640;
const PADDING = 40;
const LINE_HEIGHT = 28;
const FONT_MONO = '"Courier New", monospace';
const FONT_SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const COLOR_INK = "#1a1a1a";
const COLOR_STONE = "#8a8580";
const COLOR_LINE = "#d8d3cc";
const COLOR_PAPER = "#faf8f5";

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawDashedLine(ctx, x1, x2, y) {
  ctx.save();
  ctx.strokeStyle = COLOR_LINE;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

// Measures total height needed first (two-pass) so the canvas is sized
// correctly instead of guessing and clipping content.
function measureHeight(order) {
  // rough estimate: header + per-item (name may wrap to 2 lines) + total + footer
  const itemLines = order.items.reduce((sum, item) => {
    const nameLikelyWraps = item.name.length > 34 ? 2 : 1;
    return sum + nameLikelyWraps + 1; // +1 for the variant/qty/price sub-line
  }, 0);
  return 220 + itemLines * LINE_HEIGHT + 140;
}

export function generateOrderReceiptImage(order) {
  const height = measureHeight(order);
  const canvas = document.createElement("canvas");
  const scale = 2; // render at 2x for crisp download on high-DPI screens
  canvas.width = WIDTH * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = COLOR_PAPER;
  ctx.fillRect(0, 0, WIDTH, height);

  let y = PADDING;

  // Header: "ORDER CONFIRMED" stamp-style label
  ctx.fillStyle = COLOR_STONE;
  ctx.font = `600 11px ${FONT_MONO}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("ORDER CONFIRMED", PADDING, y);
  y += 34;

  // Order number, large
  ctx.fillStyle = COLOR_INK;
  ctx.font = `600 28px ${FONT_SANS}`;
  ctx.fillText(order.orderNumber, PADDING, y);
  y += 36;

  drawDashedLine(ctx, PADDING, WIDTH - PADDING, y);
  y += 30;

  // Items
  ctx.font = `13px ${FONT_MONO}`;
  for (const item of order.items) {
    const variantParts = [];
    if (item.variant?.size) variantParts.push(`Size ${item.variant.size}`);
    if (item.variant?.color) variantParts.push(item.variant.color);
    const variantText = variantParts.length
      ? ` (${variantParts.join(", ")})`
      : "";

    // Item name (wraps if long), price right-aligned on the same first line
    ctx.fillStyle = COLOR_INK;
    ctx.font = `14px ${FONT_SANS}`;
    const priceText = formatPrice(item.price * item.quantity);
    const priceWidth = ctx.measureText(priceText).width;
    const nameMaxWidth = WIDTH - PADDING * 2 - priceWidth - 16;

    const nameLines = wrapText(ctx, item.name, nameMaxWidth);
    ctx.fillText(nameLines[0], PADDING, y);
    ctx.textAlign = "right";
    ctx.fillText(priceText, WIDTH - PADDING, y);
    ctx.textAlign = "left";

    for (let i = 1; i < nameLines.length; i++) {
      y += LINE_HEIGHT * 0.75;
      ctx.fillText(nameLines[i], PADDING, y);
    }

    y += LINE_HEIGHT * 0.75;
    ctx.fillStyle = COLOR_STONE;
    ctx.font = `11px ${FONT_MONO}`;
    ctx.fillText(
      `${variantText ? variantText.trim() + " × " : "× "}${item.quantity}`,
      PADDING,
      y,
    );

    y += LINE_HEIGHT * 0.9;
  }

  y += 6;
  drawDashedLine(ctx, PADDING, WIDTH - PADDING, y);
  y += 36;

  // Total
  ctx.fillStyle = COLOR_STONE;
  ctx.font = `600 11px ${FONT_MONO}`;
  ctx.fillText("TOTAL", PADDING, y);

  ctx.fillStyle = COLOR_INK;
  ctx.font = `600 26px ${FONT_SANS}`;
  ctx.textAlign = "right";
  ctx.fillText(formatPrice(order.total), WIDTH - PADDING, y);
  ctx.textAlign = "left";

  y += 34;
  ctx.fillStyle = COLOR_STONE;
  ctx.font = `11px ${FONT_MONO}`;
  ctx.fillText(order.paymentMethod || "Pay on Delivery", PADDING, y);

  return canvas;
}

// Generates the receipt image and triggers a PNG download.
export function saveOrderReceiptImage(order) {
  const canvas = generateOrderReceiptImage(order);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.orderNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/png");
}
