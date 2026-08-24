import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";

const MAX_PRODUCTS = 10;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function FeaturedProducts({ products }) {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const dragStart = useRef(null);
  const featured = useMemo(
    () => shuffle(products).slice(0, MAX_PRODUCTS),
    [products],
  );
  const loopedProducts =
    featured.length > 1 ? [...featured, ...featured] : featured;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (featured.length === 0) return <p className="text-stone">Coming soon.</p>;

  const move = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  const startDrag = (event) => {
    const point = event.touches?.[0] ?? event;
    dragStart.current = {
      x: point.clientX,
      scrollLeft: trackRef.current.scrollLeft,
    };
    setDragging(true);
    setPaused(true);
  };

  const drag = (event) => {
    if (!dragStart.current || !trackRef.current) return;
    const point = event.touches?.[0] ?? event;
    trackRef.current.scrollLeft =
      dragStart.current.scrollLeft - (point.clientX - dragStart.current.x);
  };

  const endDrag = () => {
    dragStart.current = null;
    setDragging(false);
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !dragging && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <style>{`
        .featured-slider-track:not([data-paused="true"]) {
          animation: featured-products-loop ${Math.max(26, featured.length * 5)}s linear infinite;
          overflow-x: hidden;
        }
        .featured-slider-track[data-paused="true"] {
          animation-play-state: paused;
        }
        @keyframes featured-products-loop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .featured-slider-track { animation: none !important; }
        }
      `}</style>
      <div
        ref={trackRef}
        className={`featured-slider-track flex gap-4 sm:gap-6 overflow-x-auto overscroll-x-contain pb-4 snap-x snap-mandatory ${dragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        data-paused={paused || reducedMotion}
        onMouseDown={startDrag}
        onMouseMove={drag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={startDrag}
        onTouchMove={drag}
        onTouchEnd={endDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
          if (event.key === " ") {
            event.preventDefault();
            setPaused((value) => !value);
          }
        }}
        tabIndex={0}
      >
        {loopedProducts.map((product, index) => (
          <div
            className="w-[min(72vw,15rem)] shrink-0 snap-start sm:w-56"
            key={`${product._id}-${index}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-stamp text-stone">
        {featured.length} featured {featured.length === 1 ? "pair" : "pairs"}
        {reducedMotion ? " · motion reduced" : ""}
      </p>
    </div>
  );
}

export { MAX_PRODUCTS };
