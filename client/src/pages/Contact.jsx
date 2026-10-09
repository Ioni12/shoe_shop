import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Stamp from "../components/Stamp";
import Directions from "../components/Directions";

const socials = [
  { label: "Instagram", href: "https://instagram.com/kepuceearte" },
  { label: "Facebook", href: "https://facebook.com/kepuceearte" },
];

const SHOP_WHATSAPP = "355692032381"; // country code + number, no + or spaces

function buildWhatsAppLink(form, t) {
  const text = t("contact.whatsAppMessage", {
    name: form.name,
    email: form.email,
    phone: form.phone || "",
    message: form.message,
  });
  return `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function InfoBlock() {
  const { t } = useTranslation();
  return (
    <div>
      <Stamp tone="oxblood" className="mb-4 sm:mb-6 hidden md:inline-flex">
        {t("contact.stamp")}
      </Stamp>
      <h1 className="font-display text-3xl md:text-4xl mb-5 sm:mb-6 tracking-tight hidden md:block">
        {t("contact.title")}
      </h1>

      <dl className="space-y-4 sm:space-y-5 text-sm">
        <div>
          <dt className="stamp text-ink mb-1">{t("contact.businessLabel")}</dt>
          <dd className="text-stone">Këpucë e Artë</dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">{t("contact.addressLabel")}</dt>
          <dd className="text-stone">Lagja Pavaresia, Vlorë, Albania</dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">{t("contact.hoursLabel")}</dt>
          <dd className="text-stone space-y-0.5">
            <div className="flex justify-between max-w-[220px]">
              <span>{t("contact.hours.monFri")}</span>
              <span>{t("contact.hours.monFriTime")}</span>
            </div>
            <div className="flex justify-between max-w-[220px]">
              <span>{t("contact.hours.saturday")}</span>
              <span>{t("contact.hours.saturdayTime")}</span>
            </div>
            <div className="flex justify-between max-w-[220px]">
              <span>{t("contact.hours.sunday")}</span>
              <span>{t("contact.hours.sundayTime")}</span>
            </div>
          </dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">{t("contact.phoneLabel")}</dt>
          <dd className="text-stone">
            <a
              href="tel:+355692032381"
              className="hover:text-oxblood transition-colors"
            >
              +355 69 203 2381
            </a>
          </dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">{t("contact.emailLabel")}</dt>
          <dd className="text-stone">
            <a
              href="mailto:hello@kepuceearte.al"
              className="hover:text-oxblood transition-colors break-all"
            >
              hello@kepuceearte.al
            </a>
          </dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">{t("contact.socialLabel")}</dt>
          <dd className="text-stone flex flex-wrap gap-x-4 gap-y-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-oxblood transition-colors"
              >
                {s.label}
              </a>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function ContactForm({ form, submitted, onChange, onSubmit }) {
  const { t } = useTranslation();

  if (submitted) {
    return (
      <div className="border border-stone-line p-6 sm:p-8 text-center">
        <Stamp tone="oxblood" className="mb-4">
          {t("contact.sentStamp")}
        </Stamp>
        <p className="text-stone text-sm sm:text-base">{t("contact.sentMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      <div>
        <label
          htmlFor="name"
          className="stamp text-ink mb-1.5 sm:mb-2 inline-block"
        >
          {t("contact.formName")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={onChange}
          className="w-full border border-stone-line bg-paper px-4 py-2.5 sm:py-3 font-body text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="stamp text-ink mb-1.5 sm:mb-2 inline-block"
        >
          {t("contact.formEmail")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="w-full border border-stone-line bg-paper px-4 py-2.5 sm:py-3 font-body text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="stamp text-ink mb-1.5 sm:mb-2 inline-block"
        >
          {t("contact.formPhone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          className="w-full border border-stone-line bg-paper px-4 py-2.5 sm:py-3 font-body text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="stamp text-ink mb-1.5 sm:mb-2 inline-block"
        >
          {t("contact.formMessage")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={onChange}
          className="w-full border border-stone-line bg-paper px-4 py-2.5 sm:py-3 font-body text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
      >
        {t("contact.sendMessage")}
      </button>
    </form>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    document.title = `${t("contact.title")} — Këpucë e Artë`;
  }, [t]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const url = buildWhatsAppLink(form, t);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-8 sm:py-16 md:py-20">
        {/* Mobile heading */}
        <div className="md:hidden mb-5">
          <Stamp tone="oxblood" className="mb-3">
            {t("contact.stamp")}
          </Stamp>
          <h1 className="font-display text-2xl tracking-tight">
            {t("contact.title")}
          </h1>
        </div>

        {/* Mobile tab toggle */}
        <div className="md:hidden flex border border-stone-line mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-2.5 font-mono text-xs uppercase tracking-stamp transition-colors ${
              activeTab === "info"
                ? "bg-ink text-paper"
                : "text-ink hover:text-oxblood"
            }`}
          >
            {t("contact.tabInfo")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-2.5 font-mono text-xs uppercase tracking-stamp transition-colors border-l border-stone-line ${
              activeTab === "form"
                ? "bg-ink text-paper"
                : "text-ink hover:text-oxblood"
            }`}
          >
            {t("contact.tabMessage")}
          </button>
        </div>

        {/* Mobile: show only active tab */}
        <div className="md:hidden">
          {activeTab === "info" ? (
            <InfoBlock />
          ) : (
            <ContactForm
              form={form}
              submitted={submitted}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Desktop: side by side, both always visible */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 md:gap-16">
          <InfoBlock />
          <ContactForm
            form={form}
            submitted={submitted}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Map / directions */}
      <div className="border-t border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-12 sm:py-20 md:py-24">
          <Directions variant="full" />
        </div>
      </div>
    </div>
  );
}
