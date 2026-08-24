const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviewsAdmin,
} = require("../controllers/reviewController");

// Admin — flat moderation list (mounted at /api/reviews)
router.get("/", requireAuth, getAllReviewsAdmin);
router.delete("/:id", requireAuth, deleteReview);

module.exports = router;
