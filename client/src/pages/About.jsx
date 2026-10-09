import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Stamp from "../components/Stamp";

export default function About() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t("nav.about")} — Këpucë e Artë`;
  }, [t]);

  const values = [
    {
      step: "01",
      title: t("about.values.v1Title"),
      body: t("about.values.v1Body"),
    },
    {
      step: "02",
      title: t("about.values.v2Title"),
      body: t("about.values.v2Body"),
    },
    {
      step: "03",
      title: t("about.values.v3Title"),
      body: t("about.values.v3Body"),
    },
  ];

  return (
    <div>
      {/* Intro */}
      <section className="border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-28">
          <Stamp tone="oxblood" className="mb-4 sm:mb-6">
            {t("about.stamp")}
          </Stamp>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
            {t("about.title")}
          </h1>
          <p className="mt-5 sm:mt-6 max-w-xl text-stone leading-relaxed text-sm sm:text-base">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-b border-stone-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight mb-4">
              {t("about.storyTitle")}
            </h2>
          </div>
          <div className="space-y-4 text-stone leading-relaxed text-sm sm:text-base">
            <p>{t("about.storyP1")}</p>
            <p>{t("about.storyP2")}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24">
          <h2 className="font-display text-2xl sm:text-3xl mb-8 sm:mb-12">
            {t("about.valuesTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 md:gap-10">
            {values.map((v) => (
              <div key={v.step}>
                <span className="font-mono text-xs text-oxblood tracking-stamp">
                  {v.step}
                </span>
                <h3 className="font-display text-lg sm:text-xl mt-2 mb-2">
                  {v.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight mb-4">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-stone max-w-md mx-auto mb-8 text-sm sm:text-base">
            {t("about.ctaBody")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
            >
              {t("about.shopCollection")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-ink font-mono text-xs uppercase tracking-stamp hover:border-oxblood hover:text-oxblood transition-colors"
            >
              {t("about.visitShop")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
