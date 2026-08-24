const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");

// GET /api/products/:productId/reviews
// Public. Returns all reviews for a product plus a computed average rating.
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const reviews = await Review.find({ product: productId }).sort({
      createdAt: -1,
    });

    const count = reviews.length;
    const averageRating =
      count === 0
        ? 0
        : Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10,
          ) / 10;

    res.json({ reviews, count, averageRating });
  } catch (err) {
    next(err);
  }
}

// POST /api/products/:productId/reviews
// Public. Body: { reviewerName, rating, comment }
async function createReview(req, res, next) {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { reviewerName, rating, comment } = req.body;

    const review = new Review({
      product: productId,
      reviewerName,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

// DELETE /api/reviews/:id
// Admin only — moderation.
async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted", id: review._id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid review id" });
    }
    next(err);
  }
}

// GET /api/reviews
// Admin only — flat list of all reviews across all products, for a
// moderation dashboard. Newest first.
async function getAllReviewsAdmin(req, res, next) {
  try {
    const reviews = await Review.find()
      .populate("product", "name images")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProductReviews,
  createReview,
  deleteReview,
  getAllReviewsAdmin,
};
