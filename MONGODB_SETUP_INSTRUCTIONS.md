# MongoDB Setup Instructions - Step by Step

## 📦 Step 1: Install Mongoose

In your server repo (`game-day-api`), run:

```bash
npm install mongoose
```

This will add mongoose to your `package.json` dependencies.

## 🔗 Step 2: Set Up MongoDB Atlas (Free Cloud Database)

### Option A: MongoDB Atlas (Recommended)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Render deployment)
   - Or add your current IP address for local testing
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `game-day` (or your preferred database name)

### Option B: Local MongoDB (For Development Only)

If you have MongoDB installed locally:

```bash
# Connection string will be:
mongodb://localhost:27017/game-day
```

## 🔧 Step 3: Set Environment Variable

### For Local Development:

Create a `.env` file in your server repo root:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/game-day?retryWrites=true&w=majority
```

**Important:** Add `.env` to your `.gitignore` file so you don't commit your password!

### For Render Deployment:

1. Go to your Render dashboard
2. Select your service (`game-day-api`)
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Your MongoDB Atlas connection string (with password filled in)
6. Click "Save Changes"
7. Render will automatically redeploy

## 🌱 Step 4: Seed the Database (Optional)

After setting up MongoDB, you can populate it with initial data:

```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing games (optional)
- Insert 3 sample games with `imageUrl` fields

## 🚀 Step 5: Start Your Server

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
API listening on 3001
```

## 📝 Step 5: Verify It Works

1. **Test GET endpoint:**
   ```bash
   curl http://localhost:3001/api/games
   ```
   Should return an array of games (empty if you didn't seed)

2. **Test POST endpoint:**
   ```bash
   curl -X POST http://localhost:3001/api/games \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Game",
       "league": "NBA",
       "date": "2025-12-25",
       "time": "20:00",
       "venue": "Test Arena",
       "city": "Test City",
       "price": 100,
       "img": "/images/test.jpg",
       "imageUrl": "/images/test.jpg",
       "summary": "This is a test game"
     }'
   ```

3. **Check MongoDB Atlas:**
   - Go to your cluster in Atlas
   - Click "Browse Collections"
   - You should see your `games` collection with the data

## 🖼️ Step 6: About Images

### How Images Work with Render Free Plan:

**The Problem:**
- Render's free plan doesn't persist file uploads
- If you upload images to Render, they disappear after restart

**The Solution:**
- Store images **outside** Render (not in the database)
- Use `imageUrl` field to store the **URL** to the image
- Images can be hosted on:
  - GitHub Pages (your `/public/images/` folder)
  - Cloudinary (free image hosting)
  - Imgur
  - Any CDN or image hosting service

**For This Assignment:**
- Images are stored as **URLs** in MongoDB (the `imageUrl` field)
- The actual image files are hosted elsewhere (GitHub Pages, CDN, etc.)
- This satisfies the requirement: "pictures work for the whole session" because:
  - The URLs persist in MongoDB
  - The images are hosted on a persistent service (not Render)
  - Even if Render restarts, the URLs in MongoDB still point to valid images

## ✅ Verification Checklist

- [ ] Mongoose installed (`npm install mongoose`)
- [ ] MongoDB Atlas account created
- [ ] Database user created
- [ ] IP address whitelisted
- [ ] Connection string obtained
- [ ] `MONGODB_URI` set in `.env` (local) or Render environment variables
- [ ] Server starts without errors
- [ ] `npm run seed` works
- [ ] GET `/api/games` returns data
- [ ] POST `/api/games` creates new game
- [ ] PUT `/api/games/:id` updates game
- [ ] DELETE `/api/games/:id` deletes game

## 🐛 Troubleshooting

### "MongoServerError: Authentication failed"
- Check your username and password in connection string
- Make sure you replaced `<password>` with actual password

### "MongoNetworkError: connection timeout"
- Check your IP is whitelisted in MongoDB Atlas
- Try "Allow Access from Anywhere" (0.0.0.0/0)

### "MongooseError: Operation `games.insertOne()` buffering timed out"
- Check your connection string is correct
- Make sure MongoDB Atlas cluster is running (not paused)

### "No games showing"
- Run `npm run seed` to populate initial data
- Or create a game through the form

### Images not loading
- Check `imageUrl` field has valid URL
- Make sure image is hosted somewhere accessible
- For relative paths like `/images/test.jpg`, ensure images are in your `public/images/` folder

