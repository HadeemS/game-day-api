/**
 * Express Routes for Games API
 * 
 * GET    /api/games      - Get all games
 * GET    /api/games/:id   - Get a single game
 * POST   /api/games      - Create a new game (with Joi validation)
 * PUT    /api/games/:id   - Update a game (with Joi validation)
 * DELETE /api/games/:id   - Delete a game
 */

const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
const Game = require('../models/Game')

// Middleware to check MongoDB connection before processing requests
const checkConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection not ready. Please try again in a moment.',
      error: 'Database unavailable'
    })
  }
  next()
}

// Apply connection check to all routes
router.use(checkConnection)

// Joi validation schema - MUST match Mongoose schema and client-side validation
const gameSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Matchup title is required.',
      'string.min': 'Title should be at least 3 characters.',
      'string.max': 'Title must be 100 characters or less.',
      'any.required': 'Matchup title is required.',
    }),

  league: Joi.string()
    .trim()
    .min(2)
    .max(60)
    .required()
    .messages({
      'string.empty': 'League is required.',
      'string.min': 'League must be at least 2 characters.',
      'string.max': 'League must be 60 characters or less.',
      'any.required': 'League is required.',
    }),

  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty': 'Date is required.',
      'string.pattern.base': 'Use YYYY-MM-DD format.',
      'any.required': 'Date is required.',
    }),

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
    .messages({
      'string.empty': 'Kick/tip time is required.',
      'string.pattern.base': 'Use 24-hour HH:mm format.',
      'any.required': 'Kick/tip time is required.',
    }),

  venue: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required()
    .messages({
      'string.empty': 'Venue is required.',
      'string.min': 'Venue must be at least 3 characters.',
      'string.max': 'Venue must be 120 characters or less.',
      'any.required': 'Venue is required.',
    }),

  city: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required()
    .messages({
      'string.empty': 'City is required.',
      'string.min': 'City must be at least 3 characters.',
      'string.max': 'City must be 120 characters or less.',
      'any.required': 'City is required.',
    }),

  price: Joi.number()
    .integer()
    .min(0)
    .max(5000)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.integer': 'Price must be a whole number.',
      'number.min': 'Price cannot be negative.',
      'number.max': 'Price must be $5000 or less.',
      'any.required': 'Price estimate is required.',
    }),

  imageUrl: Joi.string()
    .trim()
    .pattern(/^(https?:\/\/|\/)/i)
    .required()
    .messages({
      'string.empty': 'Image URL is required.',
      'string.pattern.base': 'Image URL should start with http(s):// or /',
      'any.required': 'Image URL is required.',
    }),

  summary: Joi.string()
    .trim()
    .min(10)
    .max(280)
    .required()
    .messages({
      'string.empty': 'Summary is required.',
      'string.min': 'Summary should be at least 10 characters.',
      'string.max': 'Keep the summary under 280 characters.',
      'any.required': 'Summary is required.',
    }),
})

// Helper function to format Joi errors
function formatJoiErrors(error) {
  if (!error) return []
  return error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
  }))
}

// GET /api/games - Get all games from MongoDB
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({}).sort({ createdAt: -1 }) // Newest first
    res.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    res.status(500).json({ message: 'Error fetching games from database' })
  }
})

// GET /api/games/:id - Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    res.json({ game })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Game not found' })
    }
    console.error('Error fetching game:', error)
    res.status(500).json({ message: 'Error fetching game from database' })
  }
})

// POST /api/games - Create a new game (with Joi validation)
router.post('/', async (req, res) => {
  try {
    // Validate with Joi first
    const { error, value } = gameSchema.validate(req.body, { abortEarly: false })
    
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatJoiErrors(error),
      })
    }
    
    // Create new game in MongoDB
    const newGame = new Game(value)
    const savedGame = await newGame.save()
    
    // Return success response
    res.status(201).json({
      message: 'Game created successfully',
      game: savedGame,
    })
  } catch (error) {
    // Handle Mongoose validation errors (shouldn't happen if Joi passes, but just in case)
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      })
    }
    
    console.error('Error creating game:', error)
    res.status(500).json({ message: 'Error creating game in database' })
  }
})

// PUT /api/games/:id - Update an existing game (with Joi validation)
router.put('/:id', async (req, res) => {
  try {
    // Validate with Joi first
    const { error, value } = gameSchema.validate(req.body, { abortEarly: false })
    
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatJoiErrors(error),
      })
    }
    
    // Find and update game in MongoDB
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true } // Return updated document, run validators
    )
    
    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    // Return success response
    res.status(200).json({
      message: 'Game updated successfully',
      game: updatedGame,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      })
    }
    
    console.error('Error updating game:', error)
    res.status(500).json({ message: 'Error updating game in database' })
  }
})

// DELETE /api/games/:id - Delete a game
router.delete('/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id)
    
    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' })
    }
    
    // Return success response
    res.status(200).json({
      message: 'Game deleted successfully',
      game: deletedGame,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Game not found' })
    }
    console.error('Error deleting game:', error)
    res.status(500).json({ message: 'Error deleting game from database' })
  }
})

module.exports = router

