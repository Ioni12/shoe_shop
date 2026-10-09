import { useTranslation } from "react-i18next";
import CategoryPicker from "../../components/admin/CategoryPicker";

export default function ProductBasicFields({
  nameSq,
  setNameSq,
  nameEn,
  setNameEn,
  category,
  setCategory,
  price,
  setPrice,
  isActive,
  setIsActive,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div>
        <label
          htmlFor="product-name-sq"
          className="stamp text-ink mb-2 inline-block"
        >
          {t("admin.productForm.nameSq")}
        </label>
        <input
          id="product-name-sq"
          required
          value={nameSq}
          onChange={(e) => setNameSq(e.target.value)}
          className="w-full border border-stone-line bg-paper px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="product-name-en"
          className="stamp text-ink mb-2 inline-block"
        >
          {t("admin.productForm.nameEn")}
        </label>
        <input
          id="product-name-en"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="w-full border border-stone-line bg-paper px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="product-price"
          className="stamp text-ink mb-2 inline-block"
        >
          {t("admin.productForm.price")}
        </label>
        <input
          id="product-price"
          required
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-stone-line bg-paper px-4 py-3 text-sm"
        />
      </div>

      <div className="md:col-span-2">
        <label className="stamp text-ink mb-2 inline-block">
          {t("admin.productForm.category")}
        </label>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          {t("admin.productForm.activeLabel")}
        </label>
      </div>
    </div>
  );
}
