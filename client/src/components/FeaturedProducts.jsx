import { useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";

const MAX_PRODUCTS = 10;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function FeaturedProducts({ products }) {
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const dragStart = useRef(null);
  const pointerMoved = useRef(false);
  const featured = useMemo(
    () => shuffle(products).slice(0, MAX_PRODUCTS),
    [products],
  );

  if (featured.length === 0) return <p className="text-stone">Coming soon.</p>;

  const move = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  // Mouse-only drag (desktop click-and-drag). Touch uses native scrolling
  // for correct momentum/inertia and snap behavior on mobile.
  const startDrag = (event) => {
    dragStart.current = {
      x: event.clientX,
      scrollLeft: trackRef.current.scrollLeft,
    };
    pointerMoved.current = false;
    setDragging(true);
  };

  const drag = (event) => {
    if (!dragStart.current || !trackRef.current) return;
    pointerMoved.current = true;
    trackRef.current.scrollLeft =
      dragStart.current.scrollLeft - (event.clientX - dragStart.current.x);
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
    >
      <div
        ref={trackRef}
        className={`flex gap-4 sm:gap-6 overflow-x-auto overscroll-x-contain pb-4 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        style={{ touchAction: "pan-x pan-y" }}
        onMouseDown={startDrag}
        onMouseMove={drag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={(event) => {
          if (pointerMoved.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        tabIndex={0}
      >
        {featured.map((product) => (
          <div
            className="w-[min(72vw,15rem)] shrink-0 snap-start sm:w-56"
            key={product._id}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-stamp text-stone">
        {featured.length} featured {featured.length === 1 ? "pair" : "pairs"}
      </p>
    </div>
  );
}

export { MAX_PRODUCTS };
