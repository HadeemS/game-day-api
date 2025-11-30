# Fix MongoDB Connection on Render

## 🔍 The Problem

You're seeing the error on **Render** (not locally):
```
MongoDB connection error: bad auth : authentication failed
```

This means Render can't connect to MongoDB Atlas. Here's how to fix it:

## ✅ Step 1: Verify Your Connection String

Your connection string should be:
```
mongodb+srv://hadeemsecka_db_user:p6SOhsLJqogXtWB8@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
```

**Important parts:**
- Username: `hadeemsecka_db_user`
- Password: `p6SOhsLJqogXtWB8` (exact, no brackets)
- Database: `/game-day` (before the `?`)
- Cluster: `gameday.nf4nnn9.mongodb.net`

## ✅ Step 2: Update Render Environment Variables

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. **Click on your service** (`game-day-api` or similar)
3. **Go to "Environment" tab** (left sidebar)
4. **Find `MONGODB_URI`** environment variable
5. **Click "Edit"** or update the value
6. **Paste this exact string:**
   ```
   mongodb+srv://hadeemsecka_db_user:p6SOhsLJqogXtWB8@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
   ```
7. **Click "Save Changes"**
8. **Render will automatically redeploy**

## ✅ Step 3: Verify IP Whitelisting in MongoDB Atlas

**CRITICAL:** Render uses dynamic IPs, so you MUST allow all IPs:

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Go to "Network Access"**
3. **Check if you have `0.0.0.0/0` with status "Active"**
4. **If not, click "Add IP Address"**
5. **Click "Allow Access from Anywhere"**
6. **Click "Confirm"**
7. **Wait for status to show "Active"**

**Without this, Render cannot connect!**

## ✅ Step 4: Verify Password in MongoDB Atlas

1. **Go to MongoDB Atlas → Database Access**
2. **Find user:** `hadeemsecka_db_user`
3. **Click "Edit"**
4. **Verify the password matches:** `p6SOhsLJqogXtWB8`
5. **If different, either:**
   - Update Render's `MONGODB_URI` with the correct password, OR
   - Reset the password in MongoDB Atlas and update Render

## ✅ Step 5: Wait for Redeploy

After updating environment variables:
1. Render will automatically redeploy (takes 1-2 minutes)
2. Check the logs to see if connection succeeds
3. You should see: `✅ MongoDB connected successfully`

## 🎯 Quick Checklist

- [ ] Connection string is correct in Render environment variables
- [ ] Password matches exactly (no brackets, no spaces)
- [ ] Database name `/game-day` is included before `?`
- [ ] IP whitelisting includes `0.0.0.0/0` (allows all IPs)
- [ ] Status shows "Active" in Network Access
- [ ] Render has redeployed after changes
- [ ] Check logs for "✅ MongoDB connected successfully"

## 🐛 Still Not Working?

If it still fails after these steps:

1. **Double-check password** - Get fresh password from MongoDB Atlas
2. **Test connection locally** - Run `npm run seed` locally to verify credentials work
3. **Check Render logs** - Look for more detailed error messages
4. **Verify username** - Make sure `hadeemsecka_db_user` exists in Database Access

## 📝 Example Render Environment Variable

In Render, your `MONGODB_URI` should look exactly like this:

```
mongodb+srv://hadeemsecka_db_user:p6SOhsLJqogXtWB8@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
```

**No quotes, no extra spaces, exact format.**

