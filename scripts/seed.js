/**
 * Database Seeding Script
 * Populates MongoDB with initial game data
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/Game");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/game-day";

const initialGames = [
  {
    title: "USC vs Clemson",
    league: "NCAA Football",
    date: "2025-11-29",
    time: "19:00",
    venue: "Williams–Brice Stadium",
    city: "Columbia, SC",
    price: 85,
    img: "/images/usc-vs-clemson.jpg",
    imageUrl: "/images/usc-vs-clemson.jpg",
    summary: "Palmetto Bowl rivalry showdown."
  },
  {
    title: "Lakers vs Celtics",
    league: "NBA",
    date: "2025-12-14",
    time: "20:00",
    venue: "Crypto.com Arena",
    city: "Los Angeles, CA",
    price: 210,
    img: "/images/lakers-vs-celtics.png",
    imageUrl: "/images/lakers-vs-celtics.png",
    summary: "Classic NBA rivalry."
  },
  {
    title: "Saints vs Falcons",
    league: "NFL",
    date: "2025-12-21",
    time: "13:00",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    price: 120,
    img: "/images/saints-vs-falcons.jpg",
    imageUrl: "/images/saints-vs-falcons.jpg",
    summary: "NFC South battle."
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Game.deleteMany({});
    console.log("🗑️  Cleared existing games");

    const games = await Game.insertMany(initialGames);
    console.log(`✅ Seeded ${games.length} games successfully`);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

