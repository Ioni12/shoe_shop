import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../lib/format";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function ImageLightbox({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const dragState = useRef(null); // { startX, startY, panX, panY }
  const pinchState = useRef(null); // { startDist, startZoom }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function goTo(newIndex) {
    setIndex((newIndex + images.length) % images.length);
    resetView();
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  function clampPan(nextPan, nextZoom) {
    // At zoom 1 there's nothing to pan — lock to center.
    if (nextZoom <= 1) return { x: 0, y: 0 };
    const container = containerRef.current;
    if (!container) return nextPan;
    const { width, height } = container.getBoundingClientRect();
    const maxX = (width * (nextZoom - 1)) / 2;
    const maxY = (height * (nextZoom - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  }

  // --- Mouse drag-to-pan (desktop) ---
  function handleMouseDown(e) {
    if (zoom <= 1) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  }
  function handleMouseMove(e) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPan(
      clampPan(
        { x: dragState.current.panX + dx, y: dragState.current.panY + dy },
        zoom,
      ),
    );
  }
  function handleMouseUp() {
    dragState.current = null;
  }

  // --- Wheel-to-zoom (desktop) ---
  function handleWheel(e) {
    e.preventDefault();
    const next = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, zoom - e.deltaY * 0.002),
    );
    setZoom(next);
    setPan((p) => clampPan(p, next));
  }

  // --- Touch: pinch-to-zoom + single-finger pan ---
  function touchDistance(touches) {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      pinchState.current = {
        startDist: touchDistance(e.touches),
        startZoom: zoom,
      };
    } else if (e.touches.length === 1 && zoom > 1) {
      const t = e.touches[0];
      dragState.current = {
        startX: t.clientX,
        startY: t.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  }
  function handleTouchMove(e) {
    if (e.touches.length === 2 && pinchState.current) {
      e.preventDefault();
      const dist = touchDistance(e.touches);
      const scale = dist / pinchState.current.startDist;
      const next = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, pinchState.current.startZoom * scale),
      );
      setZoom(next);
      setPan((p) => clampPan(p, next));
    } else if (e.touches.length === 1 && dragState.current) {
      const t = e.touches[0];
      const dx = t.clientX - dragState.current.startX;
      const dy = t.clientY - dragState.current.startY;
      setPan(
        clampPan(
          { x: dragState.current.panX + dx, y: dragState.current.panY + dy },
          zoom,
        ),
      );
    }
  }
  function handleTouchEnd(e) {
    if (e.touches.length < 2) pinchState.current = null;
    if (e.touches.length === 0) dragState.current = null;
  }

  function handleDoubleClick() {
    if (zoom > 1) {
      resetView();
    } else {
      setZoom(2);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-paper font-mono text-xs uppercase tracking-stamp border border-paper px-4 py-2 hover:bg-paper hover:text-ink transition-colors"
        aria-label="Close image viewer"
      >
        Close
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-paper w-11 h-11 flex items-center justify-center border border-paper hover:bg-paper hover:text-ink transition-colors text-xl"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(index + 1)}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-paper w-11 h-11 flex items-center justify-center border border-paper hover:bg-paper hover:text-ink transition-colors text-xl"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div
        ref={containerRef}
        className="w-full h-full max-w-4xl max-h-[85vh] mx-auto overflow-hidden touch-none select-none cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={getImageUrl(images[index])}
          alt=""
          draggable={false}
          className="w-full h-full object-contain"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition:
              dragState.current || pinchState.current
                ? "none"
                : "transform 150ms ease-out",
          }}
        />
      </div>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-paper/70 font-mono text-[11px] uppercase tracking-stamp">
        {images.length > 1 ? `${index + 1} / ${images.length} — ` : ""}
        Scroll or pinch to zoom, drag to pan
      </p>
    </div>
  );
}
