# Quick Setup with Your MongoDB Connection String

You already have MongoDB Atlas set up! Here's how to use it.

## 🔐 Security First

**IMPORTANT:** You've shared your MongoDB password in this chat. For security:

1. **Change your MongoDB Atlas password** (recommended):
   - Go to MongoDB Atlas → Database Access
   - Find your user `hadeemsecka_db_user`
   - Click "Edit" → "Update Password"
   - Generate a new password

2. **Never commit passwords to Git:**
   - Use `.env` file (already in `.gitignore`)
   - Never push `.env` to GitHub

## 📝 Step 1: Create .env File

Create a `.env` file in your `game-day-api` folder:

```env
MONGODB_URI=mongodb+srv://hadeemsecka_db_user:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
```

**Replace `YOUR_PASSWORD` with your actual password.**

**Note:** Add `/game-day` before the `?` to specify the database name.

## 🚀 Step 2: Install Mongoose

```bash
cd game-day-api
npm install mongoose
```

## 🌱 Step 3: Seed Your Database

```bash
npm run seed
```

This will populate your database with 3 sample games.

## ✅ Step 4: Start Your Server

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
API listening on 3001
```

## 🔍 Step 5: Verify It Works

Test your API:
```bash
curl http://localhost:3001/api/games
```

You should see your games from MongoDB!

## 📋 For Render Deployment

1. Go to your Render dashboard
2. Select your `game-day-api` service
3. Go to "Environment" tab
4. Add environment variable:
   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://hadeemsecka_db_user:YOUR_PASSWORD@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority`
5. Click "Save Changes"
6. Render will redeploy automatically

## ✅ Your Connection String Format

Your connection string should be:
```
mongodb+srv://hadeemsecka_db_user:PASSWORD@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
```

Where:
- `hadeemsecka_db_user` = your username
- `PASSWORD` = your password (keep this secret!)
- `gameday.nf4nnn9.mongodb.net` = your cluster
- `game-day` = database name (add this!)
- `?retryWrites=true&w=majority` = connection options

## 🔒 Security Reminders

- ✅ `.env` file is in `.gitignore` (won't be committed)
- ✅ Never share your password publicly
- ✅ Use environment variables in Render
- ✅ Consider changing password if you've shared it

## 🎯 Next Steps

1. Create `.env` file with your connection string
2. Run `npm install mongoose`
3. Run `npm run seed`
4. Test with `npm start`
5. Update your client code (see `CLIENT_MONGODB_GUIDE.md`)
6. Deploy to Render with `MONGODB_URI` environment variable

