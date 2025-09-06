// index.js

const express = require("express");
const app = express();

// Use the PORT provided by the hosting platform, or 3000 for local development
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Hello World! Your app is running successfully.");
});

// Example route
app.get("/ping", (req, res) => {
  res.send("Pong!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
