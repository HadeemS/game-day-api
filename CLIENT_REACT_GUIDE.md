# React Client Implementation Guide

This guide provides all the React code you need to add POST, PUT, and DELETE functionality to your Game Day client.

## 📁 Files to Create/Update in Your Client Repo

### 1. Update `src/api/games.js` (if not already updated)

Your API helper should have these functions:

```javascript
const env =
  (typeof import.meta !== "undefined" && import.meta.env) ||
  (typeof process !== "undefined" && process.env) ||
  {};

const rawBase =
  env.VITE_API_BASE_URL ||
  env.PUBLIC_API_BASE_URL ||
  env.REACT_APP_API_BASE_URL ||
  env.API_BASE_URL ||
  "";

const API_BASE = rawBase ? rawBase.replace(/\/$/, "") : "";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail = body?.details?.join(" ") || "";
    const message = body?.error || body?.message || "Request failed";
    throw new Error(detail ? `${message} ${detail}` : message);
  }

  return body;
};

export async function getGames() {
  return request("/api/games");
}

export async function getGame(id) {
  return request(`/api/games/${id}`);
}

export async function createGame(game) {
  return request("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game)
  });
}

export async function updateGame(id, game) {
  return request(`/api/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game)
  });
}

export async function deleteGame(id) {
  return request(`/api/games/${id}`, {
    method: "DELETE"
  });
}
```

### 2. Create `src/components/GameForm.jsx`

This component handles both creating NEW games and EDITING existing games.

```jsx
import { useState } from "react";
import { createGame, updateGame } from "../api/games";

// Client-side validation matching server-side Joi schema
function validateGame(data) {
  const errors = [];
  
  // title: string().min(3).max(80).required()
  if (!data.title || data.title.trim().length < 3 || data.title.trim().length > 80) {
    errors.push("Title must be 3-80 characters");
  }
  
  // league: string().valid("NFL","NBA","NCAA Football","MLB","MLS").required()
  const validLeagues = ["NFL", "NBA", "NCAA Football", "MLB", "MLS"];
  if (!data.league || !validLeagues.includes(data.league)) {
    errors.push("League must be one of: NFL, NBA, NCAA Football, MLB, MLS");
  }
  
  // date: string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push("Date must be in YYYY-MM-DD format");
  }
  
  // time: string().pattern(/^\d{2}:\d{2}$/).required()
  if (!data.time || !/^\d{2}:\d{2}$/.test(data.time)) {
    errors.push("Time must be in HH:MM format");
  }
  
  // venue: string().min(2).max(80).required()
  if (!data.venue || data.venue.trim().length < 2 || data.venue.trim().length > 80) {
    errors.push("Venue must be 2-80 characters");
  }
  
  // city: string().min(2).max(80).required()
  if (!data.city || data.city.trim().length < 2 || data.city.trim().length > 80) {
    errors.push("City must be 2-80 characters");
  }
  
  // price: number().integer().min(0).max(10000).required()
  const priceNum = Number(data.price);
  if (isNaN(priceNum) || !Number.isInteger(priceNum) || priceNum < 0 || priceNum > 10000) {
    errors.push("Price must be an integer between 0 and 10000");
  }
  
  // img: string().pattern(/^\/images\/[a-z0-9._\-]+\.(png|jpg|jpeg|webp)$/i).required()
  if (!data.img || !/^\/images\/[a-z0-9._\-]+\.(png|jpg|jpeg|webp)$/i.test(data.img.trim())) {
    errors.push("Image must be a path like /images/filename.png (png, jpg, jpeg, or webp)");
  }
  
  // summary: string().min(5).max(240).required()
  if (!data.summary || data.summary.trim().length < 5 || data.summary.trim().length > 240) {
    errors.push("Summary must be 5-240 characters");
  }
  
  return errors.length > 0 ? errors : null;
}

export default function GameForm({ game = null, onSuccess, onCancel }) {
  const isEditing = !!game;
  
  const [formData, setFormData] = useState({
    title: game?.title || "",
    league: game?.league || "NBA",
    date: game?.date || "",
    time: game?.time || "",
    venue: game?.venue || "",
    city: game?.city || "",
    price: game?.price || 0,
    img: game?.img || "",
    summary: game?.summary || ""
  });
  
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Math.floor(Number(value) || 0) : value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) setErrors([]);
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setStatus(null);
    setIsSubmitting(true);

    // Client-side validation
    const validationErrors = validateGame(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      setStatus("error");
      setStatusMessage(validationErrors.join(". "));
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        // PUT request to update
        await updateGame(game._id, formData);
        setStatus("success");
        setStatusMessage("Game updated successfully!");
      } else {
        // POST request to create
        await createGame(formData);
        setStatus("success");
        setStatusMessage("Game posted successfully!");
        // Reset form for new entries
        setFormData({
          title: "",
          league: "NBA",
          date: "",
          time: "",
          venue: "",
          city: "",
          price: 0,
          img: "",
          summary: ""
        });
      }
      
      // Call onSuccess callback to refresh the list
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          // If editing, close the form
          if (isEditing && onCancel) {
            setTimeout(onCancel, 500);
          }
        }, 1000);
      }
    } catch (err) {
      setStatus("error");
      setStatusMessage(err.message || "Failed to save game");
      setErrors([err.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-form">
      <div className="game-form__grid">
        <div className="game-form__field">
          <label htmlFor="title">Matchup Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Lakers vs Celtics"
            required
          />
        </div>

        <div className="game-form__field">
          <label htmlFor="league">League</label>
          <select
            id="league"
            name="league"
            value={formData.league}
            onChange={handleChange}
            required
          >
            <option value="NBA">NBA</option>
            <option value="NFL">NFL</option>
            <option value="NCAA Football">NCAA Football</option>
            <option value="MLB">MLB</option>
            <option value="MLS">MLS</option>
          </select>
        </div>

        <div className="game-form__field">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="game-form__field">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="game-form__field">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Crypto.com Arena"
            required
          />
        </div>

        <div className="game-form__field">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Los Angeles, CA"
            required
          />
        </div>

        <div className="game-form__field">
          <label htmlFor="price">Starting Price (USD)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="1"
            required
          />
        </div>

        <div className="game-form__field game-form__field--full">
          <label htmlFor="img">Image Path</label>
          <input
            type="text"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="/images/usc-vs-clemson.jpg"
            required
          />
        </div>

        <div className="game-form__field game-form__field--full">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="3"
            placeholder="What makes this matchup must-see TV?"
            required
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="game-form__errors">
          {errors.map((error, idx) => (
            <p key={idx} className="game-form__error">{error}</p>
          ))}
        </div>
      )}

      {status && (
        <div className={`game-form__status game-form__status--${status}`}>
          {statusMessage}
        </div>
      )}

      <div className="game-form__footer">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="game-form__button game-form__button--secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="game-form__button game-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Game" : "Share this game"}
        </button>
      </div>
    </form>
  );
}
```

### 3. Update Your Games Page Component

Update your main Games page (likely `src/pages/Games.jsx` or similar) to include the form and list with edit/delete:

```jsx
import { useState, useEffect } from "react";
import { getGames, deleteGame } from "../api/games";
import GameForm from "../components/GameForm";
import "../styles/games.css"; // Your existing styles

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch games from server
  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGames();
      setGames(data);
    } catch (err) {
      setError(err.message || "Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  // Load games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Handle successful form submission (POST or PUT)
  const handleFormSuccess = () => {
    fetchGames(); // Refresh the list
    setShowForm(false);
    setEditingGame(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game?")) {
      return;
    }

    try {
      await deleteGame(id);
      // Remove from state immediately (optimistic update)
      setGames(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // Handle edit button click
  const handleEdit = (game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return isNaN(date) ? dateString : date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Format price
  const formatPrice = (price) => {
    return `$${Number(price || 0).toLocaleString("en-US")}`;
  };

  return (
    <div className="games-page">
      <section className="games-page__header">
        <h1>Upcoming Games</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingGame(null);
          }}
          className="games-page__add-button"
        >
          + Add New Game
        </button>
      </section>

      {/* Form Section */}
      {(showForm || editingGame) && (
        <section className="games-page__form-section">
          <div className="games-page__form-container">
            <h2>{editingGame ? "Edit Game" : "Post a New Game"}</h2>
            <GameForm
              game={editingGame}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingGame(null);
              }}
            />
          </div>
        </section>
      )}

      {/* Games List */}
      <section className="games-page__list">
        {loading && <p>Loading games...</p>}
        {error && <p className="games-page__error">Error: {error}</p>}
        
        {!loading && !error && games.length === 0 && (
          <p>No games scheduled yet. Add one above!</p>
        )}

        {!loading && !error && games.length > 0 && (
          <div className="games-grid">
            {games
              .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time))
              .map((game) => (
                <article key={game._id} className="game-card">
                  <div className="game-card__media">
                    <img src={game.img} alt={game.title} />
                    <span className="game-card__badge">{game.league}</span>
                  </div>
                  <div className="game-card__body">
                    <h3 className="game-card__title">{game.title}</h3>
                    <p className="game-card__meta">
                      {formatDate(game.date)} at {game.time}
                    </p>
                    <p className="game-card__meta">
                      {game.venue}, {game.city}
                    </p>
                    <p className="game-card__summary">{game.summary}</p>
                    <p className="game-card__price">{formatPrice(game.price)}</p>
                    
                    <div className="game-card__actions">
                      <button
                        onClick={() => handleEdit(game)}
                        className="game-card__button game-card__button--edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(game._id)}
                        className="game-card__button game-card__button--delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
```

### 4. Add CSS Styles (`src/styles/games.css`)

Add these styles to match your site design:

```css
/* Games Page */
.games-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.games-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.games-page__add-button {
  padding: 0.75rem 1.5rem;
  background: var(--accent, #f97316);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.games-page__add-button:hover {
  background: var(--accent-strong, #fb923c);
}

.games-page__form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--panel, rgba(15, 23, 42, 0.9));
  border: 1px solid var(--border, rgba(148, 163, 184, 0.3));
  border-radius: 16px;
}

.games-page__form-container h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

/* Game Form */
.game-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-form__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.game-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-form__field--full {
  grid-column: 1 / -1;
}

.game-form__field label {
  font-weight: 500;
  color: var(--text, #f8fafc);
}

.game-form__field input,
.game-form__field select,
.game-form__field textarea {
  padding: 0.75rem;
  background: var(--bg, #030712);
  border: 1px solid var(--border, rgba(148, 163, 184, 0.3));
  border-radius: 8px;
  color: var(--text, #f8fafc);
  font-family: inherit;
  transition: border-color 0.2s;
}

.game-form__field input:focus,
.game-form__field select:focus,
.game-form__field textarea:focus {
  outline: none;
  border-color: var(--accent, #f97316);
}

.game-form__field textarea {
  resize: vertical;
  min-height: 80px;
}

.game-form__errors {
  padding: 1rem;
  background: rgba(127, 29, 29, 0.2);
  border: 1px solid rgba(254, 226, 226, 0.3);
  border-radius: 8px;
}

.game-form__error {
  margin: 0.25rem 0;
  color: var(--error, #fda4af);
  font-size: 0.9rem;
}

.game-form__status {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.game-form__status--success {
  background: rgba(6, 78, 59, 0.3);
  color: #d1fae5;
  border: 1px solid rgba(209, 250, 229, 0.3);
}

.game-form__status--error {
  background: rgba(127, 29, 29, 0.3);
  color: #fee2e2;
  border: 1px solid rgba(254, 226, 226, 0.3);
}

.game-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.game-form__button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.game-form__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.game-form__button--primary {
  background: var(--accent, #f97316);
  color: white;
}

.game-form__button--primary:hover:not(:disabled) {
  background: var(--accent-strong, #fb923c);
}

.game-form__button--secondary {
  background: transparent;
  color: var(--text-muted, #94a3b8);
  border: 1px solid var(--border, rgba(148, 163, 184, 0.3));
}

.game-form__button--secondary:hover:not(:disabled) {
  background: rgba(148, 163, 184, 0.1);
}

/* Games Grid */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.game-card {
  background: var(--panel, rgba(15, 23, 42, 0.9));
  border: 1px solid var(--border, rgba(148, 163, 184, 0.3));
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.game-card__media {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.game-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.game-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: var(--panel, rgba(15, 23, 42, 0.95));
  border: 1px solid var(--border, rgba(148, 163, 184, 0.3));
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.game-card__body {
  padding: 1rem;
}

.game-card__title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.game-card__meta {
  margin: 0.25rem 0;
  color: var(--text-muted, #94a3b8);
  font-size: 0.9rem;
}

.game-card__summary {
  margin: 0.75rem 0;
  color: var(--text, #f8fafc);
  line-height: 1.5;
}

.game-card__price {
  margin: 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--success, #4ade80);
}

.game-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border, rgba(148, 163, 184, 0.3));
}

.game-card__button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.game-card__button--edit {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.game-card__button--edit:hover {
  background: rgba(59, 130, 246, 0.3);
}

.game-card__button--delete {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.game-card__button--delete:hover {
  background: rgba(239, 68, 68, 0.3);
}

.games-page__error {
  color: var(--error, #fda4af);
  padding: 1rem;
  background: rgba(127, 29, 29, 0.2);
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .games-page {
    padding: 1rem;
  }

  .games-page__header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .game-form__grid {
    grid-template-columns: 1fr;
  }

  .games-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🎯 How It All Works Together

### POST Flow (Add New Game):
1. User clicks "Add New Game" → `showForm` becomes `true`
2. User fills out `GameForm` → validation runs client-side
3. On submit → `createGame()` sends POST to `/api/games`
4. Server validates with Joi → returns 201 with new game
5. `handleFormSuccess()` calls `fetchGames()` → list updates automatically
6. Success message shows → form resets

### PUT Flow (Edit Game):
1. User clicks "Edit" on a game card → `editingGame` is set, `showForm` becomes `true`
2. `GameForm` receives `game` prop → form pre-fills with game data
3. User edits fields → validation runs client-side
4. On submit → `updateGame(id, formData)` sends PUT to `/api/games/:id`
5. Server validates with Joi → updates array → returns 200 with updated game
6. `handleFormSuccess()` calls `fetchGames()` → list updates automatically
7. Success message shows → form closes after 1 second

### DELETE Flow:
1. User clicks "Delete" → confirmation dialog appears
2. If confirmed → `deleteGame(id)` sends DELETE to `/api/games/:id`
3. Server removes from array → returns 200
4. Game is immediately removed from state (optimistic update)
5. List updates without page refresh

## ✅ Key Features Implemented

- ✅ React components with props and state
- ✅ Form for POST (add new games)
- ✅ Form for PUT (edit existing games)
- ✅ State variable for success/error messages
- ✅ List in state that auto-updates (no page refresh)
- ✅ Client-side validation matching Joi schema
- ✅ Styled forms matching your site design
- ✅ DELETE functionality with confirmation
- ✅ All requests use fetch API
- ✅ Error handling and user feedback

## 🔧 Environment Variable Setup

Make sure your client has the API base URL set. Create a `.env` file in your client repo root:

```env
VITE_API_BASE_URL=https://game-day-api-1.onrender.com
```

Or if using Create React App:
```env
REACT_APP_API_BASE_URL=https://game-day-api-1.onrender.com
```

For local development, you can leave it empty to use relative paths.

