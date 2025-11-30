# Complete MongoDB Migration Guide

This is your complete guide for migrating from in-memory arrays to MongoDB with imageUrl support.

## 📋 What Was Changed

### Server Side (`game-day-api` repo):

1. ✅ **Added Mongoose** - Database ORM for MongoDB
2. ✅ **Created `db.js`** - MongoDB connection setup
3. ✅ **Updated `models/Game.js`** - Added `imageUrl` field to schema
4. ✅ **Updated `index.js`** - All routes now use MongoDB instead of array
5. ✅ **Updated Joi schema** - Includes `imageUrl` validation
6. ✅ **Updated seed script** - Includes `imageUrl` in initial data

### Client Side (`game-day` repo):

1. ✅ **Updated `GameForm.jsx`** - Added `imageUrl` input field
2. ✅ **Updated validation** - Client-side validation includes `imageUrl` rules
3. ✅ **Updated Games page** - Displays images using `imageUrl` field

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd game-day-api
npm install mongoose
```

### Step 2: Set Up MongoDB Atlas

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0)
3. Create database user (save username/password)
4. Whitelist IP (use 0.0.0.0/0 for Render)
5. Get connection string

### Step 3: Set Environment Variable

**Local (.env file):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/game-day?retryWrites=true&w=majority
```

**Render (Environment Variables):**
- Key: `MONGODB_URI`
- Value: Your connection string (with password filled in)

### Step 4: Seed Database (Optional)

```bash
npm run seed
```

### Step 5: Start Server

```bash
npm start
```

### Step 6: Update Client

Copy code from `CLIENT_MONGODB_GUIDE.md` into your client repo.

## 📁 File Structure

```
game-day-api/
├── db.js                    # MongoDB connection
├── index.js                 # Express routes (uses MongoDB)
├── models/
│   └── Game.js              # Mongoose schema (with imageUrl)
├── scripts/
│   └── seed.js              # Seed script (with imageUrl)
├── package.json             # Includes mongoose
└── .env                     # MONGODB_URI (not in git)

game-day/
├── src/
│   ├── components/
│   │   └── GameForm.jsx     # Form with imageUrl field
│   ├── pages/
│   │   └── Games.jsx        # Page with list (uses imageUrl)
│   └── api/
│       └── games.js         # API helpers (no changes needed)
```

## 🔍 How It Works

### Data Flow:

1. **User fills form** → React state updates
2. **User submits** → Client validates → POST/PUT to server
3. **Server receives** → Joi validates → Mongoose saves to MongoDB
4. **MongoDB stores** → Document with all fields including `imageUrl`
5. **Server responds** → Returns saved document
6. **Client receives** → Updates React state → UI refreshes

### Image Handling:

- **`imageUrl` field** stores the URL to the image
- **Images hosted** on GitHub Pages (`/images/`) or external CDN
- **MongoDB stores** only the URL, not the actual image file
- **Why this works:** URLs persist in MongoDB, images persist on hosting service
- **Satisfies requirement:** "pictures work for the whole session" because URLs in MongoDB point to persistent image hosting

## ✅ Verification Checklist

### Server:
- [ ] `npm install mongoose` completed
- [ ] MongoDB Atlas account created
- [ ] `MONGODB_URI` set in `.env` or Render
- [ ] Server starts: "✅ MongoDB connected successfully"
- [ ] `npm run seed` works
- [ ] GET `/api/games` returns games from MongoDB
- [ ] POST `/api/games` creates game in MongoDB
- [ ] PUT `/api/games/:id` updates game in MongoDB
- [ ] DELETE `/api/games/:id` deletes game from MongoDB

### Client:
- [ ] `GameForm.jsx` includes `imageUrl` field
- [ ] Validation includes `imageUrl` rules
- [ ] Form submits `imageUrl` in POST/PUT
- [ ] List displays images using `imageUrl`
- [ ] Edit form pre-fills `imageUrl`
- [ ] All CRUD operations update UI immediately

## 📚 Documentation Files

1. **`MONGODB_SETUP_INSTRUCTIONS.md`** - Step-by-step MongoDB setup
2. **`CLIENT_MONGODB_GUIDE.md`** - Complete React code with imageUrl
3. **`MAIN_PAGE_HTML_SNIPPET.md`** - HTML for your 242 portfolio page
4. **`BLACKBOARD_COMMENT_TEMPLATE.md`** - Submission comment template

## 🎯 Key Points for Your Professor

### How Data is Persistent:
- **Before:** Data stored in memory array (lost on server restart)
- **Now:** Data stored in MongoDB Atlas (cloud database, persists across restarts)
- **Result:** Games remain in database even if Render restarts

### How Validation Works:
- **Server-side:** Joi validates all fields including `imageUrl` before saving to MongoDB
- **Client-side:** JavaScript validation matches Joi rules exactly
- **Both must pass:** Client gives instant feedback, server ensures security

### How Images Work:
- **Storage:** Image URLs stored in MongoDB `imageUrl` field
- **Hosting:** Actual image files hosted on GitHub Pages or CDN
- **Persistence:** URLs persist in MongoDB, images persist on hosting service
- **Result:** Images work for entire session (and beyond) because URLs point to persistent storage

## 🐛 Common Issues

### "MongoDB connection error"
- Check `MONGODB_URI` is set correctly
- Verify MongoDB Atlas cluster is running (not paused)
- Check IP is whitelisted in Atlas

### "Validation failed: imageUrl"
- Must be full URL (http:// or https://) OR relative path ending with image extension
- Examples: `https://example.com/img.jpg` or `/images/test.png`

### "Images not loading"
- Check `imageUrl` field has valid URL
- Verify image file exists at that URL
- For relative paths, ensure images are in `public/images/` folder

## 📞 Need Help?

1. Check `MONGODB_SETUP_INSTRUCTIONS.md` for detailed setup
2. Verify all environment variables are set
3. Check MongoDB Atlas dashboard for connection status
4. Review server logs for error messages

