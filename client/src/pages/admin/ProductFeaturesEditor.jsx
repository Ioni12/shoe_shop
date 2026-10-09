import { useTranslation } from "react-i18next";

export default function ProductFeaturesEditor({ features, setFeatures }) {
  const { t } = useTranslation();

  function updateFeature(i, value) {
    setFeatures((prev) => prev.map((f, idx) => (idx === i ? value : f)));
  }
  function addFeature() {
    setFeatures((prev) => [...prev, ""]);
  }
  function removeFeature(i) {
    setFeatures((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="stamp text-ink mb-3">{t("admin.productForm.features")}</div>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={f}
              onChange={(e) => updateFeature(i, e.target.value)}
              className="flex-1 border border-stone-line bg-paper px-4 py-2 text-sm"
              placeholder={t("admin.productForm.featurePlaceholder")}
              aria-label={t("admin.productForm.featureLabel", { n: i + 1 })}
            />
            <button
              type="button"
              onClick={() => removeFeature(i)}
              className="px-3 text-stone hover:text-oxblood text-sm"
              aria-label={t("admin.productForm.removeFeature", { n: i + 1 })}
            >
              {t("common.remove")}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addFeature}
        className="mt-3 font-mono text-xs uppercase tracking-stamp hover:text-oxblood"
      >
        {t("admin.productForm.addFeature")}
      </button>
    </div>
  );
}
