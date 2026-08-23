import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products as productsApi } from "../../api/client";
import ProductBasicFields from "./ProductBasicFields";
import ProductFeaturesEditor from "./ProductFeaturesEditor";
import ProductVariantsEditor from "./ProductVariantsEditor";
import ProductImagesEditor from "./ProductImagesEditor";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [features, setFeatures] = useState([]);
  const [variants, setVariants] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    productsApi
      .get(id)
      .then((p) => {
        setName(p.name || "");
        setDescription(p.description || "");
        setPrice(String(p.price ?? ""));
        setCategory(p.category || "");
        setIsActive(p.isActive !== false);
        setFeatures(p.features || []);
        setVariants(p.variants || []);
        setExistingImages(p.images || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append(
      "features",
      JSON.stringify(features.map((f) => f.trim()).filter(Boolean)),
    );
    formData.append(
      "variants",
      JSON.stringify(
        variants
          .filter((v) => v.size.trim() || v.color.trim())
          .map((v) => ({
            size: v.size.trim(),
            color: v.color.trim(),
            stock: Number(v.stock) || 0,
          })),
      ),
    );
    newImageFiles.forEach((file) => formData.append("images", file));

    try {
      if (isEdit) {
        await productsApi.update(id, formData);
      } else {
        await productsApi.create(formData);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-10">
        <p className="text-stone">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-10">
      <h1 className="font-display text-2xl md:text-3xl mb-8">
        {isEdit ? "Edit product" : "New product"}
      </h1>

      {error && (
        <div className="mb-6 border border-oxblood text-oxblood px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <ProductBasicFields
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          price={price}
          setPrice={setPrice}
          isActive={isActive}
          setIsActive={setIsActive}
        />

        <div>
          <label
            htmlFor="product-description"
            className="stamp text-ink mb-2 inline-block"
          >
            Description
          </label>
          <textarea
            id="product-description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-stone-line bg-paper px-4 py-3 text-sm resize-none"
          />
        </div>

        <ProductFeaturesEditor features={features} setFeatures={setFeatures} />

        <ProductVariantsEditor variants={variants} setVariants={setVariants} />

        <ProductImagesEditor
          existingImages={existingImages}
          newImageFiles={newImageFiles}
          setNewImageFiles={setNewImageFiles}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-stamp hover:bg-oxblood transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border border-stone-line font-mono text-xs uppercase tracking-stamp hover:border-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
