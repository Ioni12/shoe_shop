/**
 * scripts/migrate-products-i18n.js
 *
 * One-time migration: converts products where name/description are plain
 * strings into { sq: <old_value>, en: "" } objects.
 *
 * Idempotent: skips documents that are already in the new shape.
 *
 * USAGE (do NOT run against production without a backup):
 *   MONGO_URI=mongodb://... node scripts/migrate-products-i18n.js
 *
 * Or, if .env is configured in the server directory:
 *   node -e "require('dotenv').config({path:'./server/.env'})" && node scripts/migrate-products-i18n.js
 */

"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("[migrate] ERROR: MONGO_URI environment variable is not set.");
  process.exit(1);
}

// Inline schema — avoids requiring the app model so the script is self-contained.
const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Product = mongoose.model("Product", productSchema);

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("[migrate] Connected to MongoDB.");

  const all = await Product.find({}).lean();
  console.log(`[migrate] Found ${all.length} product(s) total.`);

  let skipped = 0;
  let migrated = 0;
  let errors = 0;

  for (const doc of all) {
    const nameIsString = typeof doc.name === "string";
    const descIsString = typeof doc.description === "string";

    // Already migrated if both are objects
    if (!nameIsString && !descIsString) {
      skipped++;
      continue;
    }

    const update = {};

    if (nameIsString) {
      update.name = { sq: doc.name || "", en: "" };
    }

    if (descIsString) {
      update.description = { sq: doc.description || "", en: "" };
    }

    try {
      await Product.updateOne({ _id: doc._id }, { $set: update });
      const displayName = nameIsString ? doc.name : (doc.name?.sq || doc._id.toString());
      console.log(`[migrate]   ✓ Migrated: "${displayName}" (${doc._id})`);
      migrated++;
    } catch (err) {
      console.error(`[migrate]   ✗ Error on ${doc._id}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n[migrate] Done.");
  console.log(`  Migrated : ${migrated}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Errors   : ${errors}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[migrate] Fatal error:", err.message);
  process.exit(1);
});
