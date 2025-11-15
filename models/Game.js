// models/Game.js
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  league: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  time: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 120
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 120
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 5000,
    integer: true
  },
  img: {
    type: String,
    required: true,
    trim: true,
    match: /^(https?:\/\/|\/)/
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 280
  }
}, {
  timestamps: false
});

// Convert _id to string and keep it as _id (not id) for consistency
gameSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    return ret;
  }
});

module.exports = mongoose.model("Game", gameSchema);

