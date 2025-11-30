# Fix MongoDB Connection - Authentication Failed

## 🔍 The Problem

You're getting: `bad auth : authentication failed`

This means MongoDB Atlas is rejecting your credentials. Here's how to fix it:

## ✅ Step 1: Verify Your MongoDB Atlas Connection String

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Copy the connection string** (it will look like):
   ```
   mongodb+srv://<username>:<password>@gameday.nf4nnn9.mongodb.net/?retryWrites=true&w=majority
   ```

## ✅ Step 2: Update Your Password

The password in your connection string might be wrong. To fix:

1. **Go to MongoDB Atlas → Database Access**
2. **Find your user:** `hadeemsecka_db_user`
3. **Click "Edit"**
4. **Click "Edit Password"**
5. **Generate a new password** (or set your own)
6. **Copy the new password**
7. **Update your `.env` file** with the new password

## ✅ Step 3: Whitelist Your IP Address

MongoDB Atlas blocks connections from IPs that aren't whitelisted:

1. **Go to MongoDB Atlas → Network Access**
2. **Click "Add IP Address"**
3. **For local development:**
   - Click "Add Current IP Address" (adds your current IP)
   - OR click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. **For Render deployment:**
   - You MUST add "Allow Access from Anywhere" (0.0.0.0/0)
5. **Click "Confirm"**

## ✅ Step 4: Update Your .env File

After getting the correct password, update your `.env` file:

```env
MONGODB_URI=mongodb+srv://hadeemsecka_db_user:YOUR_NEW_PASSWORD@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
```

**Important:** 
- Replace `YOUR_NEW_PASSWORD` with your actual password
- Make sure to URL-encode special characters in the password (if any)
- Keep `/game-day` before the `?` to specify the database name

## ✅ Step 5: Test the Connection

After updating your `.env` file:

```bash
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing games
Seeded 3 games successfully
Database connection closed
```

## 🔧 Alternative: Get Fresh Connection String

If you're still having issues:

1. **Go to MongoDB Atlas → Connect → Connect your application**
2. **Copy the connection string**
3. **Replace `<password>` with your actual password**
4. **Add `/game-day` before the `?`** (to specify database name)
5. **Update your `.env` file**

Example:
```
mongodb+srv://hadeemsecka_db_user:MyNewPassword123@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
```

## 🎯 Quick Checklist

- [ ] Password is correct in MongoDB Atlas
- [ ] IP address is whitelisted (0.0.0.0/0 for Render)
- [ ] Connection string includes `/game-day` before `?`
- [ ] `.env` file has correct `MONGODB_URI`
- [ ] Password doesn't have special characters that need encoding

## 🚨 Common Issues

### Issue: "bad auth : authentication failed"
- **Fix:** Check password is correct, verify username matches

### Issue: "IP not whitelisted"
- **Fix:** Add your IP or 0.0.0.0/0 in Network Access

### Issue: "Connection timeout"
- **Fix:** Check your internet connection, verify cluster is running (not paused)

### Issue: "Database name not found"
- **Fix:** MongoDB will create the database automatically when you first insert data

