import { useEffect, useRef, useState } from "react";
import { products as productsApi } from "../../api/client";
import { getImageUrl } from "../../lib/format";
import { deriveCategoryThumbnails } from "../../lib/categories";

export default function CategoryPicker({ value, onChange }) {
  const [categoryThumbs, setCategoryThumbs] = useState([]); // [{ name, image }]
  const [loading, setLoading] = useState(true);
  const [isCustom, setIsCustom] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    productsApi
      .listAll()
      .then((all) => setCategoryThumbs(deriveCategoryThumbnails(all)))
      .catch(() => {
        // quiet failure — picker still works, just without thumbnails
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (value && !categoryThumbs.some((c) => c.name === value) && !loading) {
      setIsCustom(true);
    }
  }, [value, categoryThumbs, loading]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function selectCategory(name) {
    setIsCustom(false);
    onChange(name);
    setOpen(false);
  }

  function selectOther() {
    setIsCustom(true);
    onChange("");
    setOpen(false);
  }

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter new category"
          className="w-full border border-stone-line bg-paper px-4 py-3 text-sm"
          aria-label="Custom category name"
        />
        {categoryThumbs.length > 0 && (
          <button
            type="button"
            onClick={() => selectCategory(categoryThumbs[0].name)}
            className="px-3 text-stone hover:text-oxblood text-sm whitespace-nowrap"
          >
            Use list
          </button>
        )}
      </div>
    );
  }

  const selected = categoryThumbs.find((c) => c.name === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 border border-stone-line bg-paper px-4 py-2.5 text-sm disabled:opacity-50"
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected && (
            <span className="w-7 h-7 bg-panel overflow-hidden flex-shrink-0">
              {selected.image ? (
                <img
                  src={getImageUrl(selected.image)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : null}
            </span>
          )}
          <span className={`truncate ${value ? "text-ink" : "text-stone"}`}>
            {loading ? "Loading categories…" : value || "Select a category…"}
          </span>
        </span>
        <span className="text-stone flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && !loading && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-paper border border-stone-line shadow-sm"
        >
          {categoryThumbs.map((c) => (
            <button
              key={c.name}
              type="button"
              role="option"
              aria-selected={value === c.name}
              onClick={() => selectCategory(c.name)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-panel transition-colors ${
                value === c.name ? "text-oxblood" : "text-ink"
              }`}
            >
              <span className="w-7 h-7 bg-panel overflow-hidden flex-shrink-0">
                {c.image ? (
                  <img
                    src={getImageUrl(c.image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </span>
              {c.name}
            </button>
          ))}

          <button
            type="button"
            role="option"
            aria-selected={false}
            onClick={selectOther}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left border-t border-stone-line hover:bg-panel transition-colors text-stone"
          >
            <span className="w-7 h-7 bg-panel flex items-center justify-center flex-shrink-0 text-xs">
              +
            </span>
            Other…
          </button>
        </div>
      )}
    </div>
  );
}
