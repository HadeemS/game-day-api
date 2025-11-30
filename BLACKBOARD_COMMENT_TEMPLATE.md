# Blackboard Submission Comment Template

Copy and paste this comment into your Blackboard submission:

---

## Game Day API - MongoDB Version

**Project Links:**
- Server Code (GitHub): https://github.com/HadeemS/game-day-api
- Server API (Render): https://game-day-api-1.onrender.com
- Client Code (GitHub): https://github.com/HadeemS/game-day
- Client Website (Live): https://hadeems.github.io/game-day/

**Form Location:**
The form for adding/editing games is located on the Games page. Click the "+ Add New Game" button at the top of the page to display the form. When editing, click the "Edit" button on any game card to open the form with pre-filled data.

**List Location:**
The list that pulls data from the server/MongoDB is displayed on the same Games page, below the form section. The list shows all games stored in MongoDB, sorted by date and time. Each game card displays the image, title, league, date, time, venue, city, price, and summary.

**Technical Details:**
- **Database:** MongoDB Atlas (cloud database) for persistent data storage
- **Validation:** Joi validation on the server-side, with matching client-side validation
- **Hosting:** Server deployed on Render.com, client deployed on GitHub Pages
- **Image Handling:** Images are stored as URLs in MongoDB (imageUrl field). The actual image files are hosted on GitHub Pages or external CDN, ensuring images persist even if Render restarts (satisfies the requirement that "pictures work for the whole session")

**CRUD Operations:**
- **Create (POST):** Form allows adding new games with all fields including imageUrl
- **Read (GET):** List automatically loads games from MongoDB on page load
- **Update (PUT):** Edit button on each game card allows updating all fields including imageUrl
- **Delete (DELETE):** Delete button on each game card removes games from MongoDB

All operations update the UI immediately without requiring a page refresh, using React state management.

---

## Alternative Shorter Version

If you need a shorter comment:

---

**Game Day API - MongoDB Version**

**Links:**
- Server: https://github.com/HadeemS/game-day-api | https://game-day-api-1.onrender.com
- Client: https://github.com/HadeemS/game-day | https://hadeems.github.io/game-day/

**Form Location:** Games page - Click "+ Add New Game" button to show form. Click "Edit" on any game card to edit.

**List Location:** Games page - List displays below the form, pulling all games from MongoDB.

**Tech Stack:** MongoDB Atlas (database), Joi validation (server + client), Render (server hosting), GitHub Pages (client hosting). Images stored as URLs in MongoDB, hosted externally for persistence.

---

