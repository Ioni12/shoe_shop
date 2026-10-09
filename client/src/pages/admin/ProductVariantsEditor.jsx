import { useTranslation } from "react-i18next";

const emptyVariant = { size: "", color: "", stock: 0 };

export default function ProductVariantsEditor({ variants, setVariants }) {
  const { t } = useTranslation();

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
      <div className="stamp text-ink mb-3">{t("admin.productForm.variants")}</div>
      <div className="space-y-3">
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={v.size}
              onChange={(e) => updateVariant(i, "size", e.target.value)}
              placeholder={t("admin.productForm.variantSizePlaceholder")}
              className="w-24 border border-stone-line bg-paper px-3 py-2 text-sm"
              aria-label={t("admin.productForm.variantSizeLabel", { n: i + 1 })}
            />
            <input
              value={v.color}
              onChange={(e) => updateVariant(i, "color", e.target.value)}
              placeholder={t("admin.productForm.variantColorPlaceholder")}
              className="flex-1 border border-stone-line bg-paper px-3 py-2 text-sm"
              aria-label={t("admin.productForm.variantColorLabel", { n: i + 1 })}
            />
            <input
              type="number"
              min="0"
              value={v.stock}
              onChange={(e) => updateVariant(i, "stock", e.target.value)}
              placeholder={t("admin.productForm.variantStockPlaceholder")}
              className="w-24 border border-stone-line bg-paper px-3 py-2 text-sm"
              aria-label={t("admin.productForm.variantStockLabel", { n: i + 1 })}
            />
            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="px-3 text-stone hover:text-oxblood text-sm"
              aria-label={t("admin.productForm.removeVariant", { n: i + 1 })}
            >
              {t("common.remove")}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addVariant}
        className="mt-3 font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
      >
        {t("admin.productForm.addVariant")}
      </button>
    </div>
  );
}
