/**
 * MongoDB Connection Module
 * Handles connection to MongoDB using Mongoose
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/game-day";

const connectDB = async () => {
  try {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected");
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

module.exports = {
  connectDB: connectDB,
  connection: mongoose.connection
};

