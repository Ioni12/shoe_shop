/**
 * Order confirmation email templates — sq (Albanian) and en (English).
 *
 * Usage:
 *   const { subject, html } = getOrderConfirmationEmail(order);
 *
 * The template is chosen via order.lang; falls back to sq.
 * Product names in the email use name[order.lang] || name.sq.
 */

function formatPrice(value) {
  return new Intl.NumberFormat("sq-AL", {
    style: "currency",
    currency: "ALL",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function resolveName(name, lang) {
  if (typeof name === "object" && name !== null) {
    return name[lang] || name.sq || "";
  }
  return name || "";
}

function itemRows(items, lang) {
  return items
    .map((item) => {
      const name = resolveName(item.name, lang);
      const variant = [item.variant?.size, item.variant?.color]
        .filter(Boolean)
        .join(" / ");
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;">
            ${name}${variant ? ` <span style="color:#888;font-size:12px;">(${variant})</span>` : ""}
            &times; ${item.quantity}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;font-family:monospace;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>`;
    })
    .join("");
}

const templates = {
  sq(order) {
    const lang = "sq";
    return {
      subject: `Porosia juaj u konfirmua — ${order.orderNumber}`,
      html: `
<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><title>Konfirmim porosie</title></head>
<body style="font-family:Georgia,serif;background:#faf9f7;margin:0;padding:0;">
  <div style="max-width:540px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;padding:36px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 24px;">
      Këpucë e Artë
    </p>
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 8px;">Porosia juaj u konfirmua.</h1>
    <p style="color:#666;margin:0 0 24px;font-size:15px;">
      Numri i porosisë: <strong style="font-family:monospace;">${order.orderNumber}</strong>
    </p>

    <p style="font-size:15px;color:#333;margin:0 0 24px;">
      Faleminderit, <strong>${order.customer.firstName}</strong>! Do t'ju kontaktojmë për të rregulluar dorëzimin.
      Pagesa bëhet me marrje të këpucëve — asgjë nuk detyrohet tani.
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tbody>${itemRows(order.items, lang)}</tbody>
      <tfoot>
        <tr>
          <td style="padding-top:12px;font-weight:bold;">Total</td>
          <td style="padding-top:12px;text-align:right;font-family:monospace;font-weight:bold;">
            ${formatPrice(order.total)}
          </td>
        </tr>
      </tfoot>
    </table>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0;">

    <p style="font-size:13px;color:#888;margin:0;">
      Adresa e dorëzimit: ${order.customer.address}, ${order.customer.city}<br>
      Telefoni: ${order.customer.phone}
      ${order.customer.notes ? `<br>Shënime: ${order.customer.notes}` : ""}
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
    const lang = "en";
    return {
      subject: `Your order is confirmed — ${order.orderNumber}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Order confirmation</title></head>
<body style="font-family:Georgia,serif;background:#faf9f7;margin:0;padding:0;">
  <div style="max-width:540px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;padding:36px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 24px;">
      Këpucë e Artë
    </p>
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 8px;">Your order is confirmed.</h1>
    <p style="color:#666;margin:0 0 24px;font-size:15px;">
      Order number: <strong style="font-family:monospace;">${order.orderNumber}</strong>
    </p>

    <p style="font-size:15px;color:#333;margin:0 0 24px;">
      Thanks, <strong>${order.customer.firstName}</strong>! We'll be in touch to arrange delivery.
      Pay on delivery — nothing is due now.
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tbody>${itemRows(order.items, lang)}</tbody>
      <tfoot>
        <tr>
          <td style="padding-top:12px;font-weight:bold;">Total</td>
          <td style="padding-top:12px;text-align:right;font-family:monospace;font-weight:bold;">
            ${formatPrice(order.total)}
          </td>
        </tr>
      </tfoot>
    </table>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0;">

    <p style="font-size:13px;color:#888;margin:0;">
      Delivery address: ${order.customer.address}, ${order.customer.city}<br>
      Phone: ${order.customer.phone}
      ${order.customer.notes ? `<br>Notes: ${order.customer.notes}` : ""}
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
function getOrderConfirmationEmail(order) {
  const lang = order.lang === "en" ? "en" : "sq";
  return (templates[lang] || templates.sq)(order);
}

module.exports = { getOrderConfirmationEmail };
