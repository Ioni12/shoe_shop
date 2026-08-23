import { useEffect, useRef, useState } from "react";
import { products as productsApi } from "../../api/client";
import { getImageUrl } from "../../lib/format";

const MAX_TOTAL = 6;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_EXT = ".jpg,.jpeg,.png,.webp";

export default function ProductImagesEditor({
  productId,
  existingImages,
  setExistingImages,
  newImageFiles,
  setNewImageFiles,
}) {
  const [previews, setPreviews] = useState([]); // [{ file, url }]
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [removingImage, setRemovingImage] = useState(null); // imagePath currently deleting
  const [removeError, setRemoveError] = useState(null);
  const inputRef = useRef(null);

  const remainingSlots =
    MAX_TOTAL - existingImages.length - newImageFiles.length;

  // Build/revoke object URLs whenever the file list changes.
  useEffect(() => {
    const next = newImageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [newImageFiles]);

  function validateAndAdd(fileList) {
    setValidationError(null);
    const incoming = Array.from(fileList);
    const accepted = [];
    const rejected = [];

    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(`${file.name} (unsupported type)`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        rejected.push(`${file.name} (over 5MB)`);
        continue;
      }
      accepted.push(file);
    }

    const room = MAX_TOTAL - existingImages.length - newImageFiles.length;
    const toAdd = accepted.slice(0, Math.max(0, room));
    const overflowCount = accepted.length - toAdd.length;

    if (rejected.length > 0 || overflowCount > 0) {
      const parts = [];
      if (rejected.length > 0) parts.push(`Skipped: ${rejected.join(", ")}.`);
      if (overflowCount > 0) {
        parts.push(
          `Only ${MAX_TOTAL} images allowed total — ${overflowCount} file${
            overflowCount === 1 ? "" : "s"
          } not added.`,
        );
      }
      setValidationError(parts.join(" "));
    }

    if (toAdd.length > 0) {
      setNewImageFiles((prev) => [...prev, ...toAdd]);
    }
  }

  function handleInputChange(e) {
    if (e.target.files?.length) validateAndAdd(e.target.files);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) validateAndAdd(e.dataTransfer.files);
  }

  function removeNewFile(index) {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleRemoveExisting(imagePath) {
    setRemoveError(null);

    if (existingImages.length <= 1) {
      setRemoveError(
        "A product must keep at least one image — add a replacement first.",
      );
      return;
    }
    if (!productId) return; // shouldn't happen (create mode has no existing images)

    setRemovingImage(imagePath);
    try {
      const updated = await productsApi.removeImage(productId, imagePath);
      setExistingImages(updated.images || []);
    } catch (err) {
      setRemoveError(err.message);
    } finally {
      setRemovingImage(null);
    }
  }

  const isFull = remainingSlots <= 0;

  return (
    <div>
      <div className="stamp text-ink mb-3">Images</div>

      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-stone mb-2">
            Current images
            {existingImages.length === 1 &&
              " — add a replacement before removing the last one."}
          </p>
          <div className="flex gap-3 flex-wrap">
            {existingImages.map((img) => (
              <div
                key={img}
                className="relative w-20 h-20 bg-panel overflow-hidden"
              >
                <img
                  src={getImageUrl(img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(img)}
                  disabled={removingImage === img || existingImages.length <= 1}
                  aria-label="Remove image"
                  title={
                    existingImages.length <= 1
                      ? "Add a replacement image before removing the last one"
                      : "Remove image"
                  }
                  className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center bg-ink/80 text-paper text-xs hover:bg-oxblood transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {removingImage === img ? "…" : "×"}
                </button>
              </div>
            ))}
          </div>
          {removeError && (
            <p className="text-xs text-oxblood mt-2">{removeError}</p>
          )}
        </div>
      )}

      {/* New file previews */}
      {previews.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-4">
          {previews.map((p, i) => (
            <div
              key={p.url}
              className="relative w-20 h-20 bg-panel overflow-hidden"
            >
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                aria-label={`Remove ${p.file.name}`}
                className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center bg-ink/80 text-paper text-xs hover:bg-oxblood transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isFull) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !isFull && inputRef.current?.click()}
        role="button"
        tabIndex={isFull ? -1 : 0}
        onKeyDown={(e) => {
          if (!isFull && (e.key === "Enter" || e.key === " "))
            inputRef.current?.click();
        }}
        aria-disabled={isFull}
        className={`border border-dashed px-4 py-8 text-center transition-colors ${
          isFull
            ? "border-stone-line bg-panel/50 cursor-not-allowed"
            : dragActive
              ? "border-oxblood bg-panel cursor-pointer"
              : "border-stone-line hover:border-ink cursor-pointer"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXT}
          onChange={handleInputChange}
          disabled={isFull}
          className="hidden"
          aria-label="Add product images"
        />
        {isFull ? (
          <p className="text-sm text-stone">
            Maximum of {MAX_TOTAL} images reached.
          </p>
        ) : (
          <>
            <p className="text-sm">
              Drag images here, or{" "}
              <span className="text-oxblood underline">click to browse</span>
            </p>
            <p className="text-xs text-stone mt-1">
              {remainingSlots} slot{remainingSlots === 1 ? "" : "s"} left · JPG,
              PNG, or WebP · 5MB max each
            </p>
          </>
        )}
      </div>

      {validationError && (
        <p className="text-xs text-oxblood mt-2">{validationError}</p>
      )}
    </div>
  );
}
