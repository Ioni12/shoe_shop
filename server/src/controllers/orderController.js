const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// No 0/O/1/I so codes are easy to read out over the phone.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

// Random, non-enumerable order number, e.g. "MS-7K3FQ9XD2M".
function generateOrderNumber() {
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return `MS-${code}`;
}

const normalizePhone = (p) => String(p || "").replace(/\D/g, "");

// POST /api/orders
// Public: customer places an order from their cart.
// Body: { customer: {...}, items: [{ productId, variant, quantity }] }
async function createOrder(req, res, next) {
  try {
    const { customer, items } = req.body;

    if (!customer) {
      return res
        .status(400)
        .json({ error: "Customer information is required" });
    }
    const { firstName, lastName, phone, city, address } = customer;
    if (!firstName || !lastName || !phone || !city || !address) {
      return res.status(400).json({
        error:
          "Customer firstName, lastName, phone, city, and address are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item" });
    }

    // Rebuild each line item from the DB — never trust price/name sent by the client.
    const orderItems = [];
    let total = 0;

    for (const line of items) {
      if (!line.productId || !mongoose.isValidObjectId(line.productId)) {
        return res
          .status(400)
          .json({ error: `Invalid productId: ${line.productId}` });
      }
      const quantity = Number(line.quantity) || 0;
      if (quantity < 1) {
        return res
          .status(400)
          .json({ error: "Item quantity must be at least 1" });
      }

      const product = await Product.findById(line.productId);
      if (!product || !product.isActive) {
        return res
          .status(400)
          .json({ error: `Product not available: ${line.productId}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        variant: {
          size: line.variant?.size || undefined,
          color: line.variant?.color || undefined,
        },
        quantity,
      });

      total += product.price * quantity;
    }

    // Retry on the (very unlikely) duplicate orderNumber.
    // Requires `unique: true` on orderNumber in the Order schema.
    const MAX_ATTEMPTS = 5;
    let order;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      order = new Order({
        orderNumber: generateOrderNumber(),
        customer: {
          firstName,
          lastName,
          phone,
          city,
          address,
          notes: customer.notes || "",
        },
        items: orderItems,
        total,
      });
      try {
        await order.save();
        break;
      } catch (err) {
        if (err.code === 11000 && attempt < MAX_ATTEMPTS) continue;
        throw err;
      }
    }

    res.status(201).json(order);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

// GET /api/orders
// Admin only. Returns all orders, newest first.
async function getOrders(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
// Admin only.
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid order id" });
    }
    next(err);
  }
}

// PUT /api/orders/:id/status
// Admin only. Body: { status: "Confirmed" }
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!Order.STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Order.STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();

    res.json(order);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid order id" });
    }
    next(err);
  }
}

// GET /api/orders/track/:orderNumber?phone=...
// Public: customer looks up their own order. Requires order number AND the
// phone used at checkout. Same 404 for "not found" and "wrong phone" so
// nothing leaks about which order numbers exist.
async function trackOrder(req, res, next) {
  try {
    const { orderNumber } = req.params;
    const phone = normalizePhone(req.query.phone);

    const order = await Order.findOne({ orderNumber });
    const stored = order ? normalizePhone(order.customer.phone) : "";

    if (!order || !phone || stored !== phone) {
      return res.status(404).json({ error: "No order found" });
    }

    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
};
