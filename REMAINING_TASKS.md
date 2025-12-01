# What's Left to Complete

## ✅ COMPLETED (Server-Side)

- ✅ MongoDB/Mongoose installed and configured
- ✅ Connection using MONGODB_URI environment variable
- ✅ Mongoose schema with `imageUrl` field
- ✅ Joi validation includes `imageUrl` and matches Mongoose schema
- ✅ All routes updated to use MongoDB:
  - ✅ GET `/api/games` - Returns all games from MongoDB
  - ✅ GET `/api/games/:id` - Returns single game from MongoDB
  - ✅ POST `/api/games` - Creates game in MongoDB with Joi validation
  - ✅ PUT `/api/games/:id` - Updates game in MongoDB with Joi validation
  - ✅ DELETE `/api/games/:id` - Deletes game from MongoDB
- ✅ Seed script works and populates database
- ✅ Server connects successfully to MongoDB
- ✅ Images handled via `imageUrl` field (URLs stored in MongoDB)

## ⚠️ STILL NEEDED

### 1. Client-Side React Updates (game-day repo)

You need to update your React client code to include the `imageUrl` field:

**Files to update:**
- `src/components/GameForm.jsx` - Add `imageUrl` input field
- `src/pages/Games.jsx` - Display images using `imageUrl` field
- Client-side validation - Include `imageUrl` validation rules

**What to do:**
- Copy code from `CLIENT_MONGODB_GUIDE.md` (already created in this repo)
- Update your React form to include `imageUrl` field
- Update validation to match Joi schema
- Update display to use `imageUrl` for showing images

### 2. Render Deployment

Update Render environment variables:
- Go to Render dashboard → Your service → Environment tab
- Update `MONGODB_URI` with:
  ```
  mongodb+srv://hadeemsecka_db_user:UbhuqFWzLJFlRvr1@gameday.nf4nnn9.mongodb.net/game-day?retryWrites=true&w=majority
  ```
- Make sure IP is whitelisted in MongoDB Atlas (0.0.0.0/0)

### 3. Main 242 Home Page

Add HTML snippet to your main portfolio page:
- Copy HTML from `MAIN_PAGE_HTML_SNIPPET.md`
- Add it to your main 242 portfolio page
- Should include all 4 links:
  - Server GitHub repo
  - Render server URL
  - Client GitHub repo
  - Client live website

### 4. Blackboard Submission

Use the comment template from `BLACKBOARD_COMMENT_TEMPLATE.md` for your submission.

## 📋 Quick Checklist

### Server (game-day-api):
- [x] MongoDB connected
- [x] All routes working
- [x] Joi validation includes imageUrl
- [ ] Update Render with new MONGODB_URI

### Client (game-day):
- [ ] Update GameForm.jsx with imageUrl field
- [ ] Update client-side validation
- [ ] Update Games page to display imageUrl
- [ ] Test POST with imageUrl
- [ ] Test PUT with imageUrl
- [ ] Test DELETE
- [ ] Verify images display correctly

### Main 242 Page:
- [ ] Add HTML snippet with all 4 links
- [ ] Verify all links work

### Deployment:
- [ ] Update Render MONGODB_URI
- [ ] Verify Render connects to MongoDB
- [ ] Test all API endpoints on Render
- [ ] Deploy client updates to GitHub Pages

### Submission:
- [ ] Prepare Blackboard comment
- [ ] Verify form location is clear
- [ ] Verify list location is clear
- [ ] Mention MongoDB + Joi + Render

## 🎯 Priority Order

1. **Update Client React Code** - Most important, needed for assignment
2. **Update Render MONGODB_URI** - So deployed server works
3. **Update Main 242 Page** - Required for submission
4. **Prepare Blackboard Comment** - Final step

## 📚 Reference Files

All the code you need is already in this repo:
- `CLIENT_MONGODB_GUIDE.md` - Complete React code with imageUrl
- `MAIN_PAGE_HTML_SNIPPET.md` - HTML for 242 page
- `BLACKBOARD_COMMENT_TEMPLATE.md` - Submission comment

