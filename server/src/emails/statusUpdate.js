/**
 * Order status-update email templates — sq (Albanian) and en (English).
 *
 * Usage:
 *   const { subject, html } = getStatusUpdateEmail(order);
 *
 * The template is chosen via order.lang; falls back to sq.
 */

function formatPrice(value) {
  return new Intl.NumberFormat("sq-AL", {
    style: "currency",
    currency: "ALL",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

// Human-readable status labels per language
const statusLabels = {
  sq: {
    New: "E re",
    Confirmed: "E konfirmuar",
    "In Delivery": "Në dorëzim",
    Delivered: "E dorëzuar",
    Cancelled: "E anuluar",
  },
  en: {
    New: "New",
    Confirmed: "Confirmed",
    "In Delivery": "In Delivery",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  },
};

const templates = {
  sq(order) {
    const label = statusLabels.sq[order.status] || order.status;
    return {
      subject: `Statusi i porosisë u përditësua: ${label} — ${order.orderNumber}`,
      html: `
<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><title>Përditësim statusi</title></head>
<body style="font-family:Georgia,serif;background:#faf9f7;margin:0;padding:0;">
  <div style="max-width:540px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;padding:36px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 24px;">
      Këpucë e Artë
    </p>
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 8px;">Porosia juaj u përditësua.</h1>
    <p style="color:#666;margin:0 0 24px;font-size:15px;">
      Numri i porosisë: <strong style="font-family:monospace;">${order.orderNumber}</strong>
    </p>

    <p style="font-size:15px;color:#333;margin:0 0 24px;">
      Statusi aktual: <strong>${label}</strong>
    </p>

    ${order.status === "In Delivery" ? `<p style="font-size:15px;color:#333;margin:0 0 24px;">Porosia juaj është në rrugë! Ju lutemi kini gati pagesën me marrje.</p>` : ""}
    ${order.status === "Delivered" ? `<p style="font-size:15px;color:#333;margin:0 0 24px;">Porosia juaj u dorëzua. Faleminderit që zgjodhët Këpucë e Artë!</p>` : ""}
    ${order.status === "Cancelled" ? `<p style="font-size:15px;color:#333;margin:0 0 24px;">Porosia juaj u anulua. Për çdo pyetje na kontaktoni.</p>` : ""}

    <p style="font-size:13px;color:#888;margin:24px 0 0;">
      Total: <strong style="font-family:monospace;">${formatPrice(order.total)}</strong>
    </p>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0;">
    <p style="font-size:12px;color:#aaa;margin:0;text-align:center;">
      Këpucë e Artë &bull; Lagja Pavaresia, Vlorë &bull; hello@kepuceearte.al
    </p>
  </div>
</body>
</html>`,
    };
  },

  en(order) {
    const label = statusLabels.en[order.status] || order.status;
    return {
      subject: `Order status updated: ${label} — ${order.orderNumber}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Status update</title></head>
<body style="font-family:Georgia,serif;background:#faf9f7;margin:0;padding:0;">
  <div style="max-width:540px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;padding:36px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 24px;">
      Këpucë e Artë
    </p>
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 8px;">Your order has been updated.</h1>
    <p style="color:#666;margin:0 0 24px;font-size:15px;">
      Order number: <strong style="font-family:monospace;">${order.orderNumber}</strong>
    </p>

    <p style="font-size:15px;color:#333;margin:0 0 24px;">
      Current status: <strong>${label}</strong>
    </p>

    ${order.status === "In Delivery" ? `<p style="font-size:15px;color:#333;margin:0 0 24px;">Your order is on its way! Please have payment ready on delivery.</p>` : ""}
    ${order.status === "Delivered" ? `<p style="font-size:15px;color:#333;margin:0 0 24px;">Your order has been delivered. Thank you for choosing Këpucë e Artë!</p>` : ""}
    ${order.status === "Cancelled" ? `<p style="font-size:15px;color:#333;margin:0 0 24px;">Your order has been cancelled. Please contact us if you have any questions.</p>` : ""}

    <p style="font-size:13px;color:#888;margin:24px 0 0;">
      Total: <strong style="font-family:monospace;">${formatPrice(order.total)}</strong>
    </p>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0;">
    <p style="font-size:12px;color:#aaa;margin:0;text-align:center;">
      Këpucë e Artë &bull; Lagja Pavaresia, Vlorë &bull; hello@kepuceearte.al
    </p>
  </div>
</body>
</html>`,
    };
  },
};

/**
 * Returns { subject, html } for the order's language (falls back to sq).
 * @param {object} order  - Mongoose order document (plain object or populated)
 */
function getStatusUpdateEmail(order) {
  const lang = order.lang === "en" ? "en" : "sq";
  return (templates[lang] || templates.sq)(order);
}

module.exports = { getStatusUpdateEmail };
