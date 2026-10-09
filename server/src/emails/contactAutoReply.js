/**
 * Contact form auto-reply email templates — sq (Albanian) and en (English).
 *
 * NOTE: The current contact form sends directly to WhatsApp (no backend
 * email route). This module is provided so a future email integration can
 * simply import and call getContactAutoReplyEmail(contact, lang).
 *
 * Usage:
 *   const { subject, html } = getContactAutoReplyEmail(contact, lang);
 *   // contact: { name, email, phone?, message }
 *   // lang: "sq" | "en"  (defaults to "sq")
 */

const templates = {
  sq(contact) {
    return {
      subject: `Mesazhi juaj u mor — Këpucë e Artë`,
      html: `
<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><title>Konfirmim mesazhi</title></head>
<body style="font-family:Georgia,serif;background:#faf9f7;margin:0;padding:0;">
  <div style="max-width:540px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;padding:36px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 24px;">
      Këpucë e Artë
    </p>
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 8px;">Mesazhi juaj u mor.</h1>
    <p style="font-size:15px;color:#333;margin:0 0 24px;">
      Faleminderit, <strong>${contact.name}</strong>! Do t'ju përgjigjemi sa më shpejt.
    </p>
    <blockquote style="border-left:3px solid #e5e5e5;margin:0 0 24px;padding:8px 16px;color:#666;font-size:14px;">
      ${contact.message}
    </blockquote>
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0;">
    <p style="font-size:12px;color:#aaa;margin:0;text-align:center;">
      Këpucë e Artë &bull; Lagja Pavaresia, Vlorë &bull; hello@kepuceearte.al
    </p>
  </div>
</body>
</html>`,
    };
  },

  en(contact) {
    return {
      subject: `We received your message — Këpucë e Artë`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Message received</title></head>
<body style="font-family:Georgia,serif;background:#faf9f7;margin:0;padding:0;">
  <div style="max-width:540px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;padding:36px;">
    <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin:0 0 24px;">
      Këpucë e Artë
    </p>
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 8px;">We received your message.</h1>
    <p style="font-size:15px;color:#333;margin:0 0 24px;">
      Thanks, <strong>${contact.name}</strong>! We'll get back to you as soon as possible.
    </p>
    <blockquote style="border-left:3px solid #e5e5e5;margin:0 0 24px;padding:8px 16px;color:#666;font-size:14px;">
      ${contact.message}
    </blockquote>
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
 * Returns { subject, html } for the given language (falls back to sq).
 * @param {{ name: string, email: string, phone?: string, message: string }} contact
 * @param {"sq"|"en"} lang
 */
function getContactAutoReplyEmail(contact, lang) {
  const key = lang === "en" ? "en" : "sq";
  return (templates[key] || templates.sq)(contact);
}

module.exports = { getContactAutoReplyEmail };
