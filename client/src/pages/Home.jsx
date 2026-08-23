import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Stamp from "../components/Stamp";
import ProductCard from "../components/ProductCard";
import Directions from "../components/Directions";
import { products as productsApi } from "../api/client";

const testimonials = [
  {
    quote:
      "Bought my second pair this year. Stitching hasn't budged, and the leather only gets better with wear.",
    name: "Elira B.",
    location: "Tirana",
  },
  {
    quote:
      "No account, no card details online — paid when it arrived. Shoes fit exactly as described.",
    name: "Genc M.",
    location: "Durrës",
  },
  {
    quote:
      "You can tell these are made by hand. Nothing about them feels mass-produced.",
    name: "Sara K.",
    location: "Shkodër",
  },
];

const process = [
  {
    step: "01",
    title: "Honest materials",
    body: "Full-grain leather and natural soles, sourced for durability, not shortcuts.",
  },
  {
    step: "02",
    title: "Hand-stitched",
    body: "Each pair built and finished in our Tirana workshop, not off a factory line.",
  },
  {
    step: "03",
    title: "Delivered, paid on arrival",
    body: "No online payment required — you inspect the pair, then pay at the door.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    productsApi
      .list()
      .then((data) => {
        if (!cancelled) setFeatured(data.slice(0, 4));
      })
      .catch(() => {
        // quiet failure — featured section just falls back to empty state
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-stone-line overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-12 sm:py-16 md:py-28 grid md:grid-cols-[1.2fr,1fr] gap-8 sm:gap-10 md:gap-12 items-end">
          <div>
            <Stamp tone="oxblood" className="mb-4 sm:mb-6">
              Est. Tirana
            </Stamp>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Shoes made
              <br />
              for walking.
            </h1>
            <p className="mt-4 sm:mt-6 max-w-md text-stone leading-relaxed text-sm sm:text-base">
              Këpucë e Artë is a small footwear shop in Tirana — honest
              materials, real stitching, no gimmicks. Every pair ships pay on
              delivery, nothing to enter online.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors w-full sm:w-auto"
              >
                Shop the collection
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 border border-ink font-mono text-xs uppercase tracking-stamp hover:border-oxblood hover:text-oxblood transition-colors w-full sm:w-auto"
              >
                Visit the shop
              </Link>
            </div>
          </div>

          {/* Generated pattern placeholder */}
          <div className="aspect-[4/5] bg-panel relative overflow-hidden">
            <svg
              viewBox="0 0 400 500"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="stitchGrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 0 L40 40 M40 0 L0 40"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-ink/10"
                  />
                </pattern>
              </defs>
              <rect width="400" height="500" fill="url(#stitchGrid)" />
              <circle
                cx="200"
                cy="220"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-ink/25"
              />
              <circle
                cx="200"
                cy="220"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-ink/20"
              />
              <path
                d="M120 320 Q140 260 200 250 Q260 240 260 300 Q260 340 220 350 Q160 365 120 340 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-ink/40"
              />
              <line
                x1="160"
                y1="270"
                x2="160"
                y2="330"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-ink/30"
              />
              <line
                x1="200"
                y1="260"
                x2="200"
                y2="335"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-ink/30"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="stamp text-ink text-xs text-center px-4">
                Këpucë e Artë — Tirana
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24">
        <div className="flex items-end justify-between mb-6 sm:mb-10 gap-4">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl">
            Featured pairs
          </h2>
          <Link
            to="/products"
            className="font-mono text-xs uppercase tracking-stamp hover:text-oxblood whitespace-nowrap shrink-0"
          >
            View all →
          </Link>
        </div>

        {loading && <p className="text-stone">Loading…</p>}

        {!loading && featured.length === 0 && (
          <p className="text-stone">Coming soon.</p>
        )}

        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Craftsmanship / story */}
      <section className="border-t border-stone-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <Stamp tone="oxblood" className="mb-4 sm:mb-6">
              Our craft
            </Stamp>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight">
              Built by hand, in a small workshop in Tirana.
            </h2>
          </div>
          <p className="text-stone leading-relaxed text-sm sm:text-base">
            We don't chase trends or mass-produce. Every pair that leaves our
            workshop has been cut, stitched, and finished by someone who knows
            your name — not a machine on a line. It takes longer. It's worth it.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24">
          <h2 className="font-display text-2xl sm:text-3xl mb-8 sm:mb-12">
            How it's made
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 md:gap-10">
            {process.map((p) => (
              <div key={p.step}>
                <span className="font-mono text-xs text-oxblood tracking-stamp">
                  {p.step}
                </span>
                <h3 className="font-display text-lg sm:text-xl mt-2 mb-2">
                  {p.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-stone-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24">
          <h2 className="font-display text-2xl sm:text-3xl mb-8 sm:mb-12">
            What people say
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="border border-stone-line bg-paper p-5 sm:p-6"
              >
                <p className="text-ink text-sm leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <p className="font-mono text-xs uppercase tracking-stamp text-stone">
                  {t.name} — {t.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit / directions (compact) */}
      <section className="border-t border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24">
          <Directions variant="compact" />
        </div>
      </section>
    </div>
  );
}
