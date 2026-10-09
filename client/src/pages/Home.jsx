import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Stamp from "../components/Stamp";
import FeaturedProducts from "../components/FeaturedProducts";
import Directions from "../components/Directions";
import { products as productsApi } from "../api/client";

const HERO_IMAGES = [
  "/images/hero1.webp",
  "/images/hero2.webp",
  "/images/hero3.webp",
];
const HERO_INTERVAL_MS = 2000;

function HeroBackground() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || HERO_IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0">
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, objectPosition: "center 20%" }}
        />
      ))}
      {/* Darken + gradient so outlined text stays legible on bright photos */}
      <div className="absolute inset-0 bg-ink/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10" />
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Këpucë e Artë";
  }, []);

  useEffect(() => {
    let cancelled = false;

    productsApi
      .list()
      .then((data) => {
        if (!cancelled) setFeatured(data);
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

  const process = [
    {
      step: "01",
      title: t("home.process.step1Title"),
      body: t("home.process.step1Body"),
      image: "/images/process1.webp",
    },
    {
      step: "02",
      title: t("home.process.step2Title"),
      body: t("home.process.step2Body"),
      image: "/images/process2.webp",
    },
    {
      step: "03",
      title: t("home.process.step3Title"),
      body: t("home.process.step3Body"),
      image: "/images/process3.webp",
    },
  ];

  const testimonials = [
    {
      quote: t("home.testimonials.t1Quote"),
      name: t("home.testimonials.t1Name"),
      location: t("home.testimonials.t1Location"),
    },
    {
      quote: t("home.testimonials.t2Quote"),
      name: t("home.testimonials.t2Name"),
      location: t("home.testimonials.t2Location"),
    },
    {
      quote: t("home.testimonials.t3Quote"),
      name: t("home.testimonials.t3Name"),
      location: t("home.testimonials.t3Location"),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-stone-line overflow-hidden">
        <HeroBackground />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-16 sm:py-24 md:py-40 flex flex-col items-start">
          <Stamp tone="oxblood" className="mb-4 sm:mb-6">
            {t("home.heroStamp")}
          </Stamp>
          <h1
            className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-tight text-ink"
            style={{
              WebkitTextStroke: "0.4px white",
              paintOrder: "stroke fill",
              textShadow: "0 0 1px #fff, 0 2px 20px rgba(0,0,0,0.2)",
            }}
          >
            {t("home.heroTitle").split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="mt-4 sm:mt-6 max-w-md text-paper/90 leading-relaxed text-sm sm:text-base">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 bg-paper text-ink font-mono text-xs uppercase tracking-stamp hover:bg-oxblood hover:text-paper transition-colors w-full sm:w-auto"
            >
              {t("home.shopCollection")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 border border-paper text-paper font-mono text-xs uppercase tracking-stamp hover:border-oxblood hover:text-oxblood transition-colors w-full sm:w-auto"
            >
              {t("home.visitShop")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24">
        <div className="flex items-end justify-between mb-6 sm:mb-10 gap-4">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl">
            {t("home.featuredPairs")}
          </h2>
          <Link
            to="/products"
            className="font-mono text-xs uppercase tracking-stamp hover:text-oxblood whitespace-nowrap shrink-0"
          >
            {t("home.viewAll")}
          </Link>
        </div>

        {loading && <p className="text-stone">{t("home.loadingProducts")}</p>}

        {!loading && featured.length === 0 && (
          <p className="text-stone">{t("home.comingSoon")}</p>
        )}

        {!loading && featured.length > 0 && (
          <FeaturedProducts products={featured} />
        )}
      </section>

      {/* Craftsmanship / story */}
      <section className="border-t border-stone-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <Stamp tone="oxblood" className="mb-4 sm:mb-6">
              {t("home.craftStamp")}
            </Stamp>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight">
              {t("home.craftTitle")}
            </h2>
          </div>
          <p className="text-stone leading-relaxed text-sm sm:text-base">
            {t("home.craftBody")}
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24">
          <h2 className="font-display text-2xl sm:text-3xl mb-8 sm:mb-12">
            {t("home.howItsMadeTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 md:gap-10">
            {process.map((p) => (
              <div key={p.step}>
                <div className="aspect-square w-full mb-4 overflow-hidden bg-panel">
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
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
            {t("home.testimonialsTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((tm) => (
              <div
                key={tm.name}
                className="border border-stone-line bg-paper p-5 sm:p-6"
              >
                <p className="text-ink text-sm leading-relaxed mb-4">
                  "{tm.quote}"
                </p>
                <p className="font-mono text-xs uppercase tracking-stamp text-stone">
                  {tm.name} — {tm.location}
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
