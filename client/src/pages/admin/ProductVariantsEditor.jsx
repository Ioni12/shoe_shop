const emptyVariant = { size: "", color: "", stock: 0 };

export default function ProductVariantsEditor({ variants, setVariants }) {
  function updateVariant(i, field, value) {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)),
    );
  }
  function addVariant() {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  }
  function removeVariant(i) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="stamp text-ink mb-3">Variants</div>
      <div className="space-y-3">
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={v.size}
              onChange={(e) => updateVariant(i, "size", e.target.value)}
              placeholder="Size"
              className="w-24 border border-stone-line bg-paper px-3 py-2 text-sm"
              aria-label={`Variant ${i + 1} size`}
            />
            <input
              value={v.color}
              onChange={(e) => updateVariant(i, "color", e.target.value)}
              placeholder="Color"
              className="flex-1 border border-stone-line bg-paper px-3 py-2 text-sm"
              aria-label={`Variant ${i + 1} color`}
            />
            <input
              type="number"
              min="0"
              value={v.stock}
              onChange={(e) => updateVariant(i, "stock", e.target.value)}
              placeholder="Stock"
              className="w-24 border border-stone-line bg-paper px-3 py-2 text-sm"
              aria-label={`Variant ${i + 1} stock`}
            />
            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="px-3 text-stone hover:text-oxblood text-sm"
              aria-label={`Remove variant ${i + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addVariant}
        className="mt-3 font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
      >
        + Add variant
      </button>
    </div>
  );
}
