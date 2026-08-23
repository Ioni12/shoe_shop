import { Link } from "react-router-dom";
import Stamp from "../components/Stamp";

const values = [
  {
    step: "01",
    title: "Quality over speed",
    body: "We'd rather finish one pair properly than rush ten. Every stitch is checked by hand before a shoe leaves the workshop.",
  },
  {
    step: "02",
    title: "Comfort first",
    body: "A shoe that looks good but hurts to wear isn't a good shoe. We build for the whole day, not just the first hour.",
  },
  {
    step: "03",
    title: "No middlemen markup",
    body: "We sell what we make, directly. No distributors, no retail chains — just the workshop and you.",
  },
];

export default function About() {
  return (
    <div>
      {/* Intro */}
      <section className="border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-28">
          <Stamp tone="oxblood" className="mb-4 sm:mb-6">
            Rreth nesh
          </Stamp>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
            A small workshop, doing things the slow way.
          </h1>
          <p className="mt-5 sm:mt-6 max-w-xl text-stone leading-relaxed text-sm sm:text-base">
            Këpucë e Artë started as one cutting table and a stubborn belief
            that shoes should be built to last, not replaced every season. We're
            still small — and that's on purpose.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-b border-stone-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight mb-4">
              Our story
            </h2>
          </div>
          <div className="space-y-4 text-stone leading-relaxed text-sm sm:text-base">
            <p>
              Këpucë e Artë opened in Tirana with a simple idea: buy good
              leather, hire people who actually know how to work it, and don't
              cut corners no one will notice at first — but everyone feels
              eventually.
            </p>
            <p>
              We're not a factory, and we don't want to be. Every pair that
              leaves our workshop has been handled by someone who could tell you
              exactly how it was made, because they made it.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24">
          <h2 className="font-display text-2xl sm:text-3xl mb-8 sm:mb-12">
            What we care about
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
            See what we make.
          </h2>
          <p className="text-stone max-w-md mx-auto mb-8 text-sm sm:text-base">
            Browse the current collection, or come by the workshop and try a
            pair on.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
            >
              Shop the collection
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-ink font-mono text-xs uppercase tracking-stamp hover:border-oxblood hover:text-oxblood transition-colors"
            >
              Visit the shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
