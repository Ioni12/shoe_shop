const path = require("path");
// Load server/.env no matter which folder the app is started from
// (e.g. `npm start` from the project root).
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[server] running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  }
}

start();
