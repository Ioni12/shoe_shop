const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // snapshot at time of order
    price: { type: Number, required: true }, // snapshot at time of order
    variant: {
      size: { type: String, trim: true },
      color: { type: String, trim: true },
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ORDER_STATUSES = [
  "New",
  "Confirmed",
  "In Delivery",
  "Delivered",
  "Cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // e.g. "ORD-0001"
    },
    customer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      notes: { type: String, trim: true, default: "" },
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one item",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      default: "Pay on Delivery",
      enum: ["Pay on Delivery"], // only option supported in MVP
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "New",
    },
    statusHistory: {
      type: [statusHistoryEntrySchema],
      default: () => [{ status: "New" }],
    },
  },
  { timestamps: true },
);

orderSchema.statics.STATUSES = ORDER_STATUSES;

module.exports = mongoose.model("Order", orderSchema);
