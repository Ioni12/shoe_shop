/**
 * Derives one representative thumbnail per category from a product list —
 * the first image found on the first product encountered for that category.
 * Used by both the admin CategoryPicker (fed products.listAll()) and the
 * public Products page filter (fed products.list()) — same logic, different
 * (and intentionally different-scoped) input data.
 */
export function deriveCategoryThumbnails(products) {
  const map = new Map();
  for (const p of products) {
    if (!p.category) continue;
    if (!map.has(p.category)) {
      map.set(p.category, p.images?.[0] || null);
    }
  }
  return Array.from(map.entries())
    .map(([name, image]) => ({ name, image }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
