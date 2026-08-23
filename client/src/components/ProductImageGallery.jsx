import { useState } from "react";
import { getImageUrl } from "../lib/format";
import ImageLightbox from "./ImageLightbox";

export default function ProductImageGallery({ images, productName }) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images?.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasImages && setLightboxOpen(true)}
        className="w-full aspect-square bg-panel flex items-center justify-center relative"
        aria-label={hasImages ? "Open image, zoomable" : "No image available"}
        disabled={!hasImages}
      >
        {hasImages ? (
          <img
            src={getImageUrl(images[activeImage])}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="stamp text-ink text-xs">No image</span>
        )}
      </button>

      {images?.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-16 bg-panel overflow-hidden border ${
                i === activeImage ? "border-oxblood" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === activeImage}
            >
              <img
                src={getImageUrl(img)}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          startIndex={activeImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
