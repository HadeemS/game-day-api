require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const db = require("./db");
const connectDB = db.connectDB;
const gamesRoutes = require("./routes/games");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/games", gamesRoutes);

// API info route
app.get("/api", (_req, res) => {
  res.json({
    message: "Game Day API - MongoDB Version",
    endpoints: {
      "GET /api/games": "Get all games",
      "GET /api/games/:id": "Get a single game",
      "POST /api/games": "Create a new game",
      "PUT /api/games/:id": "Update a game",
      "DELETE /api/games/:id": "Delete a game"
    },
    database: "MongoDB (Mongoose)",
    validation: "Joi + Mongoose"
  });
});

// Health check route
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Root route - serve landing page
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server only after MongoDB connection is established
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 MongoDB connection status: Connected`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

