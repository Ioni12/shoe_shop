const Product = require("../models/Product");
const path = require("path");
const fs = require("fs");

// GET /api/products
// Public: list all active products. Supports optional ?category= filter.
async function getProducts(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/all
// Admin: list ALL products including inactive ones.
async function getAllProductsAdmin(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }
    next(err);
  }
}

// POST /api/products
// Admin only (route will be protected in Phase 5). Expects multipart/form-data
// with text fields + optional "images" files.
async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, features, variants } = req.body;

    const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const product = new Product({
      name,
      description,
      price,
      category,
      // features/variants may arrive as JSON strings from a multipart form
      features: features ? JSON.parse(features) : [],
      variants: variants ? JSON.parse(variants) : [],
      images: imagePaths,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

// PUT /api/products/:id
// Admin only. Supports updating fields and optionally adding new images.
async function updateProduct(req, res, next) {
  try {
    const { name, description, price, category, features, variants, isActive } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (features !== undefined) product.features = JSON.parse(features);
    if (variants !== undefined) product.variants = JSON.parse(variants);
    if (isActive !== undefined) product.isActive = isActive;

    // Newly uploaded images get appended to the existing ones
    if (req.files && req.files.length > 0) {
      const newPaths = req.files.map((f) => `/uploads/${f.filename}`);
      product.images = [...product.images, ...newPaths];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }
    next(err);
  }
}

// DELETE /api/products/:id
// Admin only.
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted", id: product._id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }
    next(err);
  }
}

// DELETE /api/products/:id/images
// Admin only. Body: { imagePath: "/uploads/xxxx.jpg" }
// Removes one image from the product's images array and deletes the file
// from disk. Rejects if it would leave the product with zero images.
async function removeProductImage(req, res, next) {
  try {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res.status(400).json({ error: "imagePath is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.images.includes(imagePath)) {
      return res
        .status(404)
        .json({ error: "That image is not associated with this product" });
    }

    if (product.images.length === 1) {
      return res.status(400).json({
        error:
          "Cannot remove the last image — a product must have at least one image, upload a replacement first",
      });
    }

    product.images = product.images.filter((img) => img !== imagePath);
    await product.save();

    // Best-effort file cleanup — don't fail the request if this errors
    // (e.g. file already missing), just log it.
    const filename = path.basename(imagePath);
    const filePath = path.join(__dirname, "..", "..", "uploads", filename);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error(
          `[products] failed to delete file ${filePath}:`,
          err.message,
        );
      }
    });

    res.json(product);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }
    next(err);
  }
}

module.exports = {
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage,
};
