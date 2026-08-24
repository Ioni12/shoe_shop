import Stamp from "./Stamp";

const SHOP_ADDRESS = "Lungomare, 9401 Vlorë, Albania";
const MAPS_QUERY = encodeURIComponent(SHOP_ADDRESS);
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
const MAPS_DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;

const hours = [
  { day: "Mon – Fri", time: "10:00 – 19:00" },
  { day: "Saturday", time: "10:00 – 16:00" },
  { day: "Sunday", time: "Closed" },
];

/**
 * Shared shop-location component.
 * variant="compact"  -> smaller map, used on Home.jsx
 * variant="full"      -> larger map + hours + full details, used on Contact page
 */
export default function Directions({ variant = "full", className = "" }) {
  const isCompact = variant === "compact";

  return (
    <div className={className}>
      <div
        className={`grid ${
          isCompact ? "md:grid-cols-2" : "md:grid-cols-[1fr,1.1fr]"
        } gap-8 sm:gap-10 items-stretch`}
      >
        {/* Details */}
        <div className="flex flex-col justify-center">
          {!isCompact && (
            <Stamp tone="oxblood" className="mb-4 sm:mb-6 w-fit">
              Find us
            </Stamp>
          )}
          <h2
            className={`font-display tracking-tight leading-tight ${
              isCompact
                ? "text-2xl sm:text-3xl mb-3"
                : "text-3xl sm:text-4xl mb-4"
            }`}
          >
            Visit the workshop
          </h2>
          <p className="text-stone text-sm sm:text-base leading-relaxed mb-1">
            {SHOP_ADDRESS}
          </p>

          {!isCompact && (
            <div className="mt-6 space-y-1.5">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className="flex items-center justify-between max-w-xs font-mono text-xs uppercase tracking-stamp text-stone"
                >
                  <span>{h.day}</span>
                  <span className="text-ink">{h.time}</span>
                </div>
              ))}
            </div>
          )}

          <a
            href={MAPS_DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors w-fit"
          >
            Get directions
          </a>
        </div>

        {/* Map */}
        <div
          className={`border border-stone-line overflow-hidden ${
            isCompact
              ? "aspect-[4/3]"
              : "aspect-[4/3] sm:aspect-auto sm:min-h-[360px]"
          }`}
        >
          <iframe
            title="Këpucë e Artë shop location"
            src={MAPS_EMBED_SRC}
            className="w-full h-full grayscale-[15%] contrast-[1.05]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
