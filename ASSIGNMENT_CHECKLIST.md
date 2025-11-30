# Assignment Completion Checklist

Use this checklist to verify you've met all requirements before submission.

## ✅ Server Side - Part 1 (POST)

- [x] **POST route exists** (`/api/games`)
- [x] **Joi validation** - All fields validated (title, league, date, time, venue, city, price, img, summary)
- [x] **Adds to in-memory array** - Games are pushed to the `games` array
- [x] **Returns success/failure** - Returns 201 with `{ ok: true, game }` or 400 with error details

## ✅ Server Side - Part 2 (PUT + DELETE)

- [x] **PUT route exists** (`/api/games/:id`)
- [x] **PUT uses Joi validation** - Same schema as POST
- [x] **PUT updates correct item** - Finds by ID and updates in array
- [x] **PUT returns success/failure** - Returns 200 with updated game or 404/400
- [x] **DELETE route exists** (`/api/games/:id`)
- [x] **DELETE removes correct item** - Finds by ID and removes from array
- [x] **DELETE returns success/failure** - Returns 200 with deleted game or 404

## ✅ Client Side - Part 1 (POST)

- [ ] **React components used properly** - Uses functional components, hooks (useState, useEffect)
- [ ] **Form for posting new data** - `GameForm` component with all required fields
- [ ] **State variable for success message** - `status` and `statusMessage` state in GameForm
- [ ] **List auto-updates** - `fetchGames()` called after successful POST, no page refresh
- [ ] **Client-side validation** - `validateGame()` function matches Joi schema exactly
- [ ] **Form is styled** - Matches your site design, not default form styling
- [ ] **Images sized properly** - Uses `object-fit: cover` and proper dimensions

## ✅ Client Side - Part 2 (PUT + DELETE)

- [ ] **Edit functionality** - Edit button on each game card
- [ ] **Edit form** - Same `GameForm` component used for editing (receives `game` prop)
- [ ] **PUT request sent** - `updateGame()` function calls PUT endpoint
- [ ] **200 response handled** - Success message shown, list updates automatically
- [ ] **Updated data visible** - No page refresh needed, list re-fetches
- [ ] **Delete functionality** - Delete button on each game card
- [ ] **DELETE request sent** - `deleteGame()` function calls DELETE endpoint
- [ ] **200 response handled** - Game disappears from UI immediately
- [ ] **Client-side validation for edit** - Same validation function used
- [ ] **Edit/delete UI styled** - Buttons match site design

## ✅ Main 242 Home Page

- [ ] **Link to server-side GitHub** - Visible on main page
- [ ] **Link to Render server URL** - Visible on main page
- [ ] **Link to client-side GitHub** - Visible on main page
- [ ] **Link to client-side live website** - Visible on main page

## 🧪 Testing Checklist

### Test POST:
1. [ ] Fill out form with valid data
2. [ ] Submit form
3. [ ] See success message
4. [ ] New game appears in list immediately (no refresh)
5. [ ] Try invalid data - see validation errors

### Test PUT:
1. [ ] Click "Edit" on a game card
2. [ ] Form pre-fills with game data
3. [ ] Change some fields
4. [ ] Submit form
5. [ ] See success message
6. [ ] Updated game appears in list with new data (no refresh)

### Test DELETE:
1. [ ] Click "Delete" on a game card
2. [ ] Confirm deletion
3. [ ] Game disappears from list immediately (no refresh)
4. [ ] Try canceling - game stays

### Test Validation:
1. [ ] Try title < 3 characters - see error
2. [ ] Try invalid date format - see error
3. [ ] Try invalid image path - see error
4. [ ] Try price > 10000 - see error
5. [ ] Try invalid league - see error

## 📝 Files to Verify

### Server Repo (`game-day-api`):
- [ ] `index.js` - Has POST, PUT, DELETE routes
- [ ] `src/api/games.js` - Has `createGame`, `updateGame`, `deleteGame` functions
- [ ] `data/games.js` - Initial games data

### Client Repo (`game-day`):
- [ ] `src/api/games.js` - Has all three API functions
- [ ] `src/components/GameForm.jsx` - Form component with validation
- [ ] `src/pages/Games.jsx` (or similar) - Main page with list and form
- [ ] `src/styles/games.css` - Styling for form and cards

### Main 242 Page (`Hadeem-Secka.github.io`):
- [ ] Links section visible
- [ ] All four links work and point to correct URLs

## 🎤 Interview/Explanation Prep

Be ready to explain:

1. **What each route does:**
   - POST: Creates a new game, validates with Joi, adds to array
   - PUT: Updates existing game by ID, validates with Joi, updates array
   - DELETE: Removes game by ID from array

2. **How validation works:**
   - Server: Joi schema validates all fields (min/max lengths, patterns, types)
   - Client: Same rules implemented in JavaScript function
   - Both must pass for request to succeed

3. **How state updates:**
   - After successful POST/PUT/DELETE, `fetchGames()` is called
   - This fetches fresh data from server
   - React state updates, causing re-render
   - No page refresh needed

4. **React concepts used:**
   - `useState` for form data, games list, loading, errors
   - `useEffect` to fetch games on component mount
   - Props to pass game data to form for editing
   - Components for reusable form logic

