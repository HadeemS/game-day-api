// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const Joi = require("joi");
const games = require("./data/games");

const app = express();
app.use(cors());
app.use(express.json());

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

const getNextId = () => {
  if (!games.length) return 1;
  return Math.max(...games.map(game => Number(game._id))) + 1;
};

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
app.get("/api/games", (_req, res) => res.json(games));
app.get("/api/games/:id", (req, res) => {
  const item = games.find(g => String(g._id) === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// JSON preview page for iframe
app.get("/api/games-preview", (_req, res) => {
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
});

app.post("/api/games", (req, res) => {
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

  const duplicate = games.find(
    game =>
      game.title.toLowerCase() === value.title.toLowerCase() &&
      game.date === value.date
  );
  if (duplicate) {
    return res
      .status(409)
      .json({ error: "That game is already on the schedule." });
  }

  const newGame = {
    _id: getNextId(),
    ...value,
    price: Number(value.price)
  };

  games.push(newGame);

  res.status(201).json({
    success: true,
    message: "Game created",
    game: newGame
  });
});

// human landing page
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
