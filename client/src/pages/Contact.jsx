import { useState } from "react";
import Stamp from "../components/Stamp";
import Directions from "../components/Directions";

const socials = [
  { label: "Instagram", href: "https://instagram.com/kepuceearte" },
  { label: "Facebook", href: "https://facebook.com/kepuceearte" },
];

const SHOP_WHATSAPP = "355698167273"; // country code + number, no + or spaces

function buildWhatsAppLink(form) {
  const lines = [
    `New message from the website:`,
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    form.phone ? `Phone: ${form.phone}` : null,
    ``,
    form.message,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SHOP_WHATSAPP}?text=${text}`;
}

function InfoBlock() {
  return (
    <div>
      <Stamp tone="oxblood" className="mb-4 sm:mb-6 hidden md:inline-flex">
        Get in touch
      </Stamp>
      <h1 className="font-display text-3xl md:text-4xl mb-5 sm:mb-6 tracking-tight hidden md:block">
        Visit or write to us
      </h1>

      <dl className="space-y-4 sm:space-y-5 text-sm">
        <div>
          <dt className="stamp text-ink mb-1">Business</dt>
          <dd className="text-stone">Këpucë e Artë</dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">Address</dt>
          <dd className="text-stone">
            Rruga Myslym Shyri 49, 1001 Tirana, Albania
          </dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">Hours</dt>
          <dd className="text-stone space-y-0.5">
            <div className="flex justify-between max-w-[220px]">
              <span>Mon – Fri</span>
              <span>10:00 – 19:00</span>
            </div>
            <div className="flex justify-between max-w-[220px]">
              <span>Saturday</span>
              <span>10:00 – 16:00</span>
            </div>
            <div className="flex justify-between max-w-[220px]">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">Phone</dt>
          <dd className="text-stone">
            <a
              href="tel:+355698167273"
              className="hover:text-oxblood transition-colors"
            >
              +355 69 81 67 273
            </a>
          </dd>
        </div>
        <div>
          <dt className="stamp text-ink mb-1">Email</dt>
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
          <dt className="stamp text-ink mb-1">Social</dt>
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
  if (submitted) {
    return (
      <div className="border border-stone-line p-6 sm:p-8 text-center">
        <Stamp tone="oxblood" className="mb-4">
          Message sent
        </Stamp>
        <p className="text-stone text-sm sm:text-base">
          Thanks for reaching out — we'll get back to you soon.
        </p>
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
          Name
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
          Email
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
          Phone
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
          Message
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
        Send message
      </button>
    </form>
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const url = buildWhatsAppLink(form);
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
            Get in touch
          </Stamp>
          <h1 className="font-display text-2xl tracking-tight">
            Visit or write to us
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
            Info
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
            Message us
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
