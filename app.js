const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => res.send("✅ Bot is Running 24/7!"));

const PORT = process.env.PORT || 3000;
const URL = "https://t4m1m.onrender.com"; // tor render URL

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Self ping every 1 minute
setInterval(() => {
  axios.get(URL).catch(() => {});
}, 1 * 60 * 1000); // 1 min
