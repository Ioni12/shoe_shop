import { Link } from "react-router-dom";
import Stamp from "./Stamp";
import { getImageUrl, formatPrice } from "../lib/format";

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="aspect-[4/5] bg-panel overflow-hidden relative">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="stamp text-ink text-xs">No image</span>
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 left-3">
            <Stamp tone="ink" className="bg-paper/90">
              {product.category}
            </Stamp>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="font-display text-lg group-hover:text-oxblood transition-colors">
          {product.name}
        </h3>
        <span className="font-mono text-sm text-stone">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
