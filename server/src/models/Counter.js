const mongoose = require("mongoose");

// Generic counter collection used to generate sequential, human-friendly
// numbers (e.g. order numbers) without race conditions. One document per
// counter name, incremented atomically via findOneAndUpdate.
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
