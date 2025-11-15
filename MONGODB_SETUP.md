# MongoDB Migration Guide

## What Changed

Your application has been migrated from in-memory array storage to MongoDB using Mongoose.

### Files Created:
- `models/Game.js` - MongoDB schema/model for games
- `scripts/seed.js` - Script to populate the database with initial games
- `MONGODB_SETUP.md` - This file

### Files Modified:
- `package.json` - Added mongoose dependency and seed script
- `index.js` - Updated to use MongoDB instead of array

### Files No Longer Used:
- `data/games.js` - Can be kept for reference, but data now comes from MongoDB

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB Connection

**Option A: Local MongoDB**
- Install MongoDB locally or use MongoDB Atlas (free cloud option)
- Default connection: `mongodb://localhost:27017/game-day`
- The app will use this if `MONGODB_URI` is not set

**Option B: MongoDB Atlas (Recommended for deployment)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster (free tier available)
- Get your connection string
- Set environment variable: `MONGODB_URI`

**Option C: Render MongoDB**
- If using Render, they provide MongoDB add-ons
- Set `MONGODB_URI` in your Render environment variables

### 3. Seed the Database (Optional)
Run this to populate your database with the initial 3 games:
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
```

## Environment Variables

Set `MONGODB_URI` in your environment:
```bash
# .env file (create this in root directory)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/game-day?retryWrites=true&w=majority
```

Or set it in your deployment platform (Render, Heroku, etc.)

## Deployment Notes

### For Render.com:
1. Add MongoDB service or use MongoDB Atlas
2. Set `MONGODB_URI` in Environment Variables section
3. Deploy as usual - `npm install` will install mongoose
4. Optionally run `npm run seed` after first deployment

### For Other Platforms:
- Make sure to set `MONGODB_URI` environment variable
- MongoDB Atlas is recommended for production

## What Works the Same

- All API endpoints work the same way
- Client-side code doesn't need any changes
- Same JSON responses
- Same validation rules (Joi + Mongoose schema)

## What's Different

- Data persists in MongoDB (survives server restarts)
- `_id` is now MongoDB ObjectId (automatically converted to string in responses)
- More scalable - can handle larger datasets
- Better error handling for database operations

## Troubleshooting

**Connection Error:**
- Make sure MongoDB is running (if local)
- Check `MONGODB_URI` is set correctly
- Verify network access to MongoDB Atlas if using cloud

**No Games Showing:**
- Run `npm run seed` to populate initial data
- Or add games through the form

**ObjectId Issues:**
- The model automatically converts ObjectIds to strings
- Client code should work without changes

