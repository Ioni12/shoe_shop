const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      sq: { type: String, required: [true, "Product name (sq) is required"], trim: true },
      en: { type: String, default: "", trim: true },
    },
    description: {
      sq: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String], // stored as paths like /uploads/filename.jpg
      default: [],
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    features: {
      type: [String], // short bullet points e.g. "Genuine leather", "Water resistant"
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true, // lets admin "hide" a product without deleting it
    },
  },
  { timestamps: true },
);

// Text index on both language variants for search
productSchema.index({ "name.sq": "text", "name.en": "text", "description.sq": "text", "description.en": "text" });

module.exports = mongoose.model("Product", productSchema);
