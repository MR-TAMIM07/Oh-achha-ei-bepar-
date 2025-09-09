const express = require("express");
const axios = require("axios");
const app = express();

// === Config ===
const PORT = process.env.PORT || 3000;
const URL = "https://t4m1m.onrender.com";

// === Root Route ===
app.get("/", (req, res) => {
  console.log("✅ Ping received at", new Date().toLocaleTimeString());
  res.send("✅ Bot is Running 24/7!");
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`
┌───────────────────────────────┐
│   🌟 BOT STATUS: ONLINE 🌟   │
│   Server running on port: ${PORT} │
└───────────────────────────────┘
`);
});

// === Self-Ping Every 1 Minute ===
setInterval(async () => {
  try {
    await axios.get(URL);
    console.log("🔄 Self-ping successful at", new Date().toLocaleTimeString());
  } catch (err) {
    console.log("⚠️ Ping failed at", new Date().toLocaleTimeString());
  }
}, 60 * 1000); // 1 min

// Optional: Keep Node alive (Render free plan)
setInterval(() => {}, 1000 * 60 * 60); // Dummy interval every hour
