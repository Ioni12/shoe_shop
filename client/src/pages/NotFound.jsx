import { Link } from "react-router-dom";
import Stamp from "../components/Stamp";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 py-20 sm:py-28 md:py-36 text-center">
      <Stamp tone="oxblood" className="mb-5 sm:mb-6">
        404
      </Stamp>
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.95] mb-4">
        Page not found.
      </h1>
      <p className="text-stone max-w-md mx-auto mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors"
        >
          Back to home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-6 py-3 border border-ink font-mono text-xs uppercase tracking-stamp hover:border-oxblood hover:text-oxblood transition-colors"
        >
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
