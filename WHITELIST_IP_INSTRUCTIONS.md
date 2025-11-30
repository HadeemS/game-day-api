# How to Whitelist Your IP Address in MongoDB Atlas

## 📋 Step-by-Step Instructions

### Step 1: Go to MongoDB Atlas
1. Open your browser
2. Go to: https://cloud.mongodb.com/
3. Log in to your account

### Step 2: Navigate to Network Access
1. In the left sidebar, click **"Network Access"**
   - It's usually under "Security" section
   - Icon looks like a shield or network

### Step 3: Add IP Address
1. Click the green **"Add IP Address"** button (top right)
2. You'll see a popup with options

### Step 4: Choose Your Option

**Option A: Add Your Current IP (Recommended for Testing)**
- Click **"Add Current IP Address"** button
- This automatically detects and adds your current IP
- Click **"Confirm"**

**Option B: Allow Access from Anywhere (Easier, but less secure)**
- Click **"Allow Access from Anywhere"**
- This adds `0.0.0.0/0` (allows all IPs)
- Click **"Confirm"**
- ⚠️ **Note:** This is less secure but works for development and Render deployment

### Step 5: Wait for Activation
- The IP address will show as "Pending" for a few seconds
- It will change to "Active" when ready
- Usually takes 1-2 minutes

### Step 6: Test Your Connection
Once the IP is whitelisted, test your connection:

```bash
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing games
Seeded 3 games successfully
```

## 🎯 For Render Deployment

If you're deploying to Render, you **MUST** use:
- **"Allow Access from Anywhere"** (0.0.0.0/0)
- Render uses dynamic IPs that change, so you can't whitelist a specific IP

## ✅ Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Went to "Network Access" section
- [ ] Clicked "Add IP Address"
- [ ] Chose "Add Current IP Address" OR "Allow Access from Anywhere"
- [ ] Clicked "Confirm"
- [ ] Waited for status to show "Active"
- [ ] Tested connection with `npm run seed`

## 🐛 Still Not Working?

If it still doesn't work after whitelisting:

1. **Check the status** - Make sure it says "Active" (not "Pending")
2. **Wait a minute** - Sometimes it takes a moment to propagate
3. **Try "Allow Access from Anywhere"** - This is the most permissive option
4. **Check your password** - Make sure the password in your `.env` file is correct
5. **Verify connection string** - Make sure it includes `/game-day` before the `?`

## 📸 Visual Guide

The Network Access page should look like this:
```
Network Access
┌─────────────────────────────────────────┐
│  [Add IP Address] button (green)       │
├─────────────────────────────────────────┤
│  IP Address        Access List         │
│  0.0.0.0/0         Active              │
│  (or your IP)      Active               │
└─────────────────────────────────────────┘
```

