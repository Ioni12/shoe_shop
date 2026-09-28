const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
} = require("../controllers/orderController");

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
});

// Public
router.post("/", createOrder);
router.get("/track/:orderNumber", trackLimiter, trackOrder); // must come before /:id

// Admin only
router.get("/", requireAuth, getOrders);
router.get("/:id", requireAuth, getOrderById);
router.put("/:id/status", requireAuth, updateOrderStatus);

module.exports = router;
