// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const Joi = require("joi");
const Game = require("./models/Game");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/game-day";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
  console.error("Server will still start, but database operations will fail.");
  console.error("Make sure MongoDB is running or set MONGODB_URI environment variable.");
});

const gameSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  league: Joi.string().trim().min(2).max(60).required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/, "ISO date (YYYY-MM-DD)")
    .required(),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/, "24-hour time (HH:mm)")
    .required(),
  venue: Joi.string().trim().min(3).max(120).required(),
  city: Joi.string().trim().min(3).max(120).required(),
  price: Joi.number().integer().min(0).max(5000).required(),
  img: Joi.string()
    .trim()
    .pattern(/^(https?:\/\/|\/)/, "absolute URL or asset path")
    .required(),
  summary: Joi.string().trim().min(10).max(280).required()
});

// Removed getNextId - MongoDB handles _id automatically

// serve /public (index.html, styles.css, /images/*)
app.use(express.static(path.join(__dirname, "public")));
// API index
app.get("/api", (req, res) => {
  res.json({
    routes: [
      { method: "GET", path: "/api/games" },
      { method: "GET", path: "/api/games/:id" },
      { method: "POST", path: "/api/games" }
    ]
  });
});

// list + detail
app.get("/api/games", async (_req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Unable to fetch games" });
  }
});

app.get("/api/games/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid game ID" });
    }
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Not found" });
    res.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ error: "Unable to fetch game" });
  }
});

// JSON preview page for iframe
app.get("/api/games-preview", async (_req, res) => {
  try {
    const games = await Game.find({});
    const jsonString = JSON.stringify(games, null, 2);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Games JSON</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 1rem;
            overflow: auto;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .json-key { color: #9cdcfe; }
          .json-string { color: #ce9178; }
          .json-number { color: #b5cea8; }
          .json-boolean { color: #569cd6; }
          .json-null { color: #569cd6; }
        </style>
      </head>
      <body>
        <pre>${jsonString.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching games for preview:", error);
    res.status(500).send("<html><body><p>Error loading games</p></body></html>");
  }
});

app.post("/api/games", async (req, res) => {
  const { value, error } = gameSchema.validate(req.body, {
    abortEarly: false,
    convert: true
  });

  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map(detail => detail.message.replace(/["]/g, ""))
    });
  }

  try {
    // Check for duplicate
    const duplicate = await Game.findOne({
      title: { $regex: new RegExp(`^${value.title}$`, "i") },
      date: value.date
    });

    if (duplicate) {
      return res
        .status(409)
        .json({ error: "That game is already on the schedule." });
    }

    // Create new game
    const newGame = new Game({
      ...value,
      price: Number(value.price)
    });

    await newGame.save();

    res.status(201).json({
      success: true,
      message: "Game created",
      game: newGame
    });
  } catch (dbError) {
    console.error("Database error:", dbError);
    res.status(500).json({ error: "Unable to save game" });
  }
});

// human landing page
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
