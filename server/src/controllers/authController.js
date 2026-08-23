const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// POST /api/auth/login
// Body: { username, password }
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = signToken(admin);
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/setup
// One-time bootstrap: creates the first admin account, ONLY if no admin
// already exists. After the first admin is created, this always returns 403.
// Body: { username, password }
async function setupFirstAdmin(req, res, next) {
  try {
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      return res.status(403).json({
        error: "Setup already completed. An admin account already exists.",
      });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const passwordHash = await Admin.hashPassword(password);
    const admin = new Admin({ username: username.toLowerCase(), passwordHash });
    await admin.save();

    const token = signToken(admin);
    res
      .status(201)
      .json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username already taken" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

// GET /api/auth/me
// Protected: returns the currently authenticated admin (sanity check for tokens).
async function getMe(req, res) {
  res.json({ admin: req.admin });
}

module.exports = { login, setupFirstAdmin, getMe };
