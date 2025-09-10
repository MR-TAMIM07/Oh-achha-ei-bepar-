const express = require("express");
const app = express();

// Web server for uptime
app.get("/", (req, res) => res.send("✅ Bot is Running 24/7!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --- Your bot code ---
console.log("Bot is starting...");

// Example bot loop (replace with your bot logic)
setInterval(() => {
    console.log("Bot is working...");
}, 60000);
