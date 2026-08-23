const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  trackOrder,
} = require("../controllers/orderController");

// Public
router.post("/", createOrder);
router.get("/track/:orderNumber", trackOrder); // must come before /:id

// Admin only
router.get("/", requireAuth, getOrders);
router.get("/:id", requireAuth, getOrderById);
router.put("/:id/status", requireAuth, updateOrderStatus);

module.exports = router;
