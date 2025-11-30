// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const Joi = require("joi");
let games = require("./data/games");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve landing + /images

// --- Validation schema (matches client) ---
const gameSchema = Joi.object({
  title: Joi.string().min(3).max(80).required(),
  league: Joi.string().valid("NFL","NBA","NCAA Football","MLB","MLS").required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  venue: Joi.string().min(2).max(80).required(),
  city: Joi.string().min(2).max(80).required(),
  price: Joi.number().integer().min(0).max(10000).required(),
  img: Joi.string().pattern(/^\/images\/[a-z0-9._\-]+\.(png|jpg|jpeg|webp)$/i).required(),
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

app.get("/api/games", (_req, res) => res.json(games));

app.get("/api/games/:id", (req, res) => {
  const item = games.find(g => String(g._id) === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.post("/api/games", (req, res) => {
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map(d => d.message)
    });
  }
  const nextId = games.length ? Math.max(...games.map(g => g._id)) + 1 : 1;
  const game = { _id: nextId, ...value };
  games.push(game);
  res.status(201).json({ ok: true, game });
});

app.put("/api/games/:id", (req, res) => {
  const { error, value } = gameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map(d => d.message)
    });
  }
  const id = parseInt(req.params.id, 10);
  const index = games.findIndex(g => g._id === id);
  if (index === -1) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }
  games[index] = { _id: id, ...value };
  res.status(200).json({ ok: true, game: games[index] });
});

app.delete("/api/games/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = games.findIndex(g => g._id === id);
  if (index === -1) {
    return res.status(404).json({ ok: false, error: "Game not found" });
  }
  const deleted = games.splice(index, 1)[0];
  res.status(200).json({ ok: true, game: deleted });
});

// Landing
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
