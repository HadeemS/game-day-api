// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const games = require("./data/games");

const app = express();
app.use(cors());
app.use(express.json());

// serve /public (index.html, styles.css, /images/*)
app.use(express.static(path.join(__dirname, "public")));

// API index
app.get("/api", (req, res) => {
  res.json({
    routes: [
      { method: "GET", path: "/api/games" },
      { method: "GET", path: "/api/games/:id" }
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

// human landing page
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
