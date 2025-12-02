const express = require("express");
const Joi = require("joi");
const Game = require("../models/Game");

const router = express.Router();

const gameSchema = Joi.object({
  title: Joi.string().min(3).max(80).required(),
  league: Joi.string()
    .valid("NFL", "NBA", "NCAA Football", "MLB", "MLS")
    .required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  venue: Joi.string().min(2).max(80).required(),
  city: Joi.string().min(2).max(80).required(),
  price: Joi.number().integer().min(0).max(10000).required(),
  img: Joi.string()
    .pattern(/^(https?:\/\/|\/)/i) // More flexible: just needs to start with http://, https://, or /
    .required(),
  imageUrl: Joi.string()
    .pattern(/^(https?:\/\/[^\s]+|\/[^\s]+\.(png|jpg|jpeg|webp|gif)$)/i)
    .required(),
  summary: Joi.string().min(5).max(240).required()
});

const formatJoiErrors = (error) => {
  if (!error) return [];
  return error.details.map((detail) => detail.message);
};

router.get("/", async (_req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch games", message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Game not found" });
    }
    res
      .status(500)
      .json({ error: "Failed to fetch game", message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { error, value } = gameSchema.validate(req.body, {
    abortEarly: false
  });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: formatJoiErrors(error)
    });
  }

  try {
    const game = await Game.create(value);
    res.status(201).json({ ok: true, game });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "Failed to create game",
      message: err.message
    });
  }
});

router.put("/:id", async (req, res) => {
  // Remove any extra fields that aren't in the schema (like _id, __v, etc.)
  const cleanBody = {
    title: req.body.title,
    league: req.body.league,
    date: req.body.date,
    time: req.body.time,
    venue: req.body.venue,
    city: req.body.city,
    price: req.body.price,
    img: req.body.img,
    imageUrl: req.body.imageUrl,
    summary: req.body.summary
  };

  const { error, value } = gameSchema.validate(cleanBody, {
    abortEarly: false
  });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: formatJoiErrors(error)
    });
  }

  try {
    const game = await Game.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true
    });
    if (!game) {
      return res.status(404).json({ ok: false, error: "Game not found" });
    }
    res.json({ ok: true, game });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ ok: false, error: "Game not found" });
    }
    res.status(500).json({
      ok: false,
      error: "Failed to update game",
      message: err.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ ok: false, error: "Game not found" });
    }
    res.json({ ok: true, game });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ ok: false, error: "Game not found" });
    }
    res.status(500).json({
      ok: false,
      error: "Failed to delete game",
      message: err.message
    });
  }
});

module.exports = router;

