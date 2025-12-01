/**
 * Mongoose Model for Game
 * 
 * This schema defines the structure of game documents in MongoDB.
 * Fields match the Joi validation schema exactly.
 */

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  league: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60,
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
  },
  time: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/, // HH:mm format (24-hour)
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 120,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 120,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 5000,
    validate: {
      validator: Number.isInteger,
      message: 'Price must be a whole number',
    },
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    match: /^(https?:\/\/|\/)/i, // Must start with http://, https://, or /
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 280,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
})

// Create and export the model
const Game = mongoose.model('Game', gameSchema)

module.exports = Game

