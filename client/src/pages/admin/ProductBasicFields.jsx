import CategoryPicker from "../../components/admin/CategoryPicker";

export default function ProductBasicFields({
  name,
  setName,
  category,
  setCategory,
  price,
  setPrice,
  isActive,
  setIsActive,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div>
        <label
          htmlFor="product-name"
          className="stamp text-ink mb-2 inline-block"
        >
          Name
        </label>
        <input
          id="product-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-stone-line bg-paper px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="product-price"
          className="stamp text-ink mb-2 inline-block"
        >
          Price
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
        <label className="stamp text-ink mb-2 inline-block">Category</label>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active (visible on public site)
        </label>
      </div>
    </div>
  );
}
