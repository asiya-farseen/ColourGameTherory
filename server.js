// Simple Express server for Azure App Service deployment
const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the root directory
app.use(express.static("."));

// Handle SPA routing - serve index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get port from environment variable or use 3000 as default
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🎮 Memory & Word Games server running on port ${port}`);
  console.log(`🌐 Visit: http://localhost:${port}`);
});
