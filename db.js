/**
 * MongoDB Connection File
 * 
 * This file handles connecting to MongoDB using Mongoose.
 * Uses MONGODB_URI environment variable (set in Render dashboard).
 */

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameday'

// Connection event handlers
const db = mongoose.connection

db.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

db.once('open', () => {
  // Connection success is logged in connectDB() to avoid duplicate logs
})

db.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// Handle app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed due to app termination')
  process.exit(0)
})

// Function to connect to MongoDB and return a promise
async function connectDB() {
  try {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected')
      return mongoose.connection
    }

    // If connection is in progress, wait for it
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ MongoDB connection in progress, waiting...')
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout after 30 seconds'))
        }, 30000)

        mongoose.connection.once('open', () => {
          clearTimeout(timeout)
          console.log('✅ Connected to MongoDB successfully')
          resolve(mongoose.connection)
        })
        
        mongoose.connection.once('error', (error) => {
          clearTimeout(timeout)
          reject(error)
        })
      })
    }

    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...')
    
    // Set up promise to wait for 'open' event
    // This must be set up BEFORE calling mongoose.connect()
    const connectionPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout after 30 seconds'))
      }, 30000)

      // Use 'once' to avoid duplicate listeners
      mongoose.connection.once('open', () => {
        clearTimeout(timeout)
        console.log('✅ Connected to MongoDB successfully')
        resolve(mongoose.connection)
      })
      
      mongoose.connection.once('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
    })

    // Start the connection (this is non-blocking)
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((error) => {
      // This catch handles immediate connection errors
      // The promise above will handle async errors via the 'error' event
      console.error('❌ MongoDB connection error:', error.message)
    })

    // Wait for the connection to be fully established
    return await connectionPromise
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    throw error
  }
}

// Export both the connection and the connect function
db.connectDB = connectDB
module.exports = db

