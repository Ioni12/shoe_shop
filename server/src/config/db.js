const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  mongoose.connection.on("connected", () => {
    console.log("[db] connected:", mongoose.connection.name);
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err.message);
  });

  await mongoose.connect(uri);
}

module.exports = { connectDB };
