const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

// Static file serving for uploaded product images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check — useful to confirm the server + DB are alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ code: "notFound", message: "Not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  // Multer-specific errors (bad file type, file too large, too many files)
  if (err.name === "MulterError") {
    const codeMap = {
      LIMIT_FILE_SIZE: { code: "imageTooLarge", message: "One or more images exceed the 5MB size limit" },
      LIMIT_FILE_COUNT: { code: "tooManyImages", message: "Too many images uploaded (max 6)" },
      LIMIT_UNEXPECTED_FILE: { code: "unexpectedFileField", message: "Unexpected file field" },
    };
    const mapped = codeMap[err.code] || { code: "unexpectedFileField", message: err.message };
    return res.status(400).json(mapped);
  }
  if (err.message && err.message.includes("Only .jpg, .jpeg, .png")) {
    return res.status(400).json({
      code: "imageTypeInvalid",
      message: err.message,
    });
  }

  console.error(err);
  res.status(err.status || 500).json({
    code: "serverError",
    message: err.message || "Internal server error",
  });
});

module.exports = app;
