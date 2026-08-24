const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const requireAuth = require("../middleware/auth");
const {
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage,
} = require("../controllers/productController");
const {
  getProductReviews,
  createReview,
} = require("../controllers/reviewController");

// Public routes
router.get("/", getProducts);

// Admin routes — /all must come before /:id or Express will treat "all" as an id
router.get("/all", requireAuth, getAllProductsAdmin);
router.post("/", requireAuth, upload.array("images", 6), createProduct);
router.put("/:id", requireAuth, upload.array("images", 6), updateProduct);
router.delete("/:id/images", requireAuth, removeProductImage); // must come before /:id
router.delete("/:id", requireAuth, deleteProduct);

// Reviews nested under a product — must come before /:id
router.get("/:productId/reviews", getProductReviews);
router.post("/:productId/reviews", createReview);

// Public route with dynamic param — must be registered after /all and /:id/reviews
router.get("/:id", getProductById);

module.exports = router;
