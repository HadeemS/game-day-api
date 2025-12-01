# Update Render with New MongoDB Connection String

## ✅ Local Connection Working

Your local `.env` file has been updated and tested successfully!

## 🚀 Update Render

### Step 1: Go to Render Dashboard
1. Go to: https://dashboard.render.com/
2. Log in to your account

### Step 2: Find Your Service
1. Click on your service: **`game-day-api-1`** (or whatever it's named)
2. Go to the **"Environment"** tab in the left sidebar

### Step 3: Update MONGODB_URI
1. Find the **`MONGODB_URI`** environment variable
2. Click **"Edit"** or update the value
3. Paste this exact string:
   ```
   mongodb+srv://hadeemsecka_db_user:v2pKdJsaXGJ5OKyM@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy (takes 1-2 minutes)

### Step 4: Verify Connection
After redeploy, check the logs:
- Go to **"Logs"** tab
- You should see: `✅ MongoDB connected successfully`
- You should see: `API listening on [port]`

## ⚠️ Important Notes

- **Password:** `v2pKdJsaXGJ5OKyM` (new password)
- **Database:** `game-day` (we're using this name, not `gameday`)
- **IP Whitelisting:** Make sure `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access

## ✅ After Updating

Once Render redeploys:
1. Test the API: `https://game-day-api-1.onrender.com/api/games`
2. Should return your games from MongoDB (no timeout errors)
3. Form submissions should work correctly

