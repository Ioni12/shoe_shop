const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  login,
  setupFirstAdmin,
  getMe,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/setup", setupFirstAdmin); // self-locking after first admin is created
router.get("/me", requireAuth, getMe);

module.exports = router;
