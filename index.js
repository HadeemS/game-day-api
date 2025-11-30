// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const Joi = require("joi");
const connectDB = require("./db");
const Game = require("./models/Game");

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve landing + /images

// --- Validation schema (matches Mongoose schema and client) ---
const gameSchema = Joi.object({
  title: Joi.string().min(3).max(80).required(),
  league: Joi.string().valid("NFL","NBA","NCAA Football","MLB","MLS").required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  venue: Joi.string().min(2).max(80).required(),
  city: Joi.string().min(2).max(80).required(),
  price: Joi.number().integer().min(0).max(10000).required(),
  img: Joi.string().pattern(/^\/images\/[a-z0-9._\-]+\.(png|jpg|jpeg|webp)$/i).required(),
  imageUrl: Joi.string().pattern(/^(https?:\/\/[^\s]+|\/[^\s]+\.(png|jpg|jpeg|webp|gif)$)/i).required(),
  summary: Joi.string().min(5).max(240).required()
});

// --- Routes ---
app.get("/api", (_req, res) => {
  res.json({
    routes: [
      { method: "GET", path: "/api/games" },
      { method: "GET", path: "/api/games/:id" },
      { method: "POST", path: "/api/games" },
      { method: "PUT", path: "/api/games/:id" },
      { method: "DELETE", path: "/api/games/:id" }
    ]
  });
});

// GET all games
app.get("/api/games", async (_req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch games", message: error.message });
  }
});

// GET single game by ID
app.get("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game", message: error.message });
  }
});

// POST - Create new game
app.post("/api/games", async (req, res) => {
  // Validate with Joi first
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map(d => d.message)
    });
  }

  try {
    // Create new game in MongoDB
    const game = new Game(value);
    const savedGame = await game.save();
    res.status(201).json({ ok: true, game: savedGame });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Failed to create game",
      message: error.message
    });
  }
});

// PUT - Update existing game
app.put("/api/games/:id", async (req, res) => {
  // Validate with Joi first
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map(d => d.message)
    });
  }

  try {
    // Find and update game in MongoDB
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );
    
    if (!game) {
      return res.status(404).json({ ok: false, error: "Game not found" });
    }
    
    res.status(200).json({ ok: true, game });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Failed to update game",
      message: error.message
    });
  }
});

// DELETE - Remove game
app.delete("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ ok: false, error: "Game not found" });
    }
    
    res.status(200).json({ ok: true, game });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Failed to delete game",
      message: error.message
    });
  }
});

// Landing
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
