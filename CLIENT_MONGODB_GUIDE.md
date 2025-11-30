# Client-Side React Updates for MongoDB + imageUrl

This guide provides all the React code you need to update your client to work with MongoDB and include the new `imageUrl` field.

## 📁 Files to Update in Your Client Repo

### 1. Update `src/components/GameForm.jsx`

Here's the complete updated form component with `imageUrl` field:

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
  
  // imageUrl: string().pattern(/^(https?:\/\/[^\s]+|\/[^\s]+\.(png|jpg|jpeg|webp|gif)$)/i).required()
  if (!data.imageUrl || !/^(https?:\/\/[^\s]+|\/[^\s]+\.(png|jpg|jpeg|webp|gif)$)/i.test(data.imageUrl.trim())) {
    errors.push("Image URL must be a full URL (http:// or https://) or a relative path ending with .png, .jpg, .jpeg, .webp, or .gif");
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
    imageUrl: game?.imageUrl || game?.img || "", // Use imageUrl if available, fallback to img
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
          imageUrl: "",
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
          <label htmlFor="img">Image Path (Legacy)</label>
          <input
            type="text"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="/images/usc-vs-clemson.jpg"
            required
          />
          <small style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            Relative path like /images/filename.jpg
          </small>
        </div>

        <div className="game-form__field game-form__field--full">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/images/usc-vs-clemson.jpg or https://example.com/image.jpg"
            required
          />
          <small style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            Full URL (http:// or https://) or relative path ending with .png, .jpg, .jpeg, .webp, or .gif
          </small>
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

### 2. Update Your Games Page Component

Update your main Games page (likely `src/pages/Games.jsx`) to display the `imageUrl`:

```jsx
import { useState, useEffect } from "react";
import { getGames, deleteGame } from "../api/games";
import GameForm from "../components/GameForm";
import "../styles/games.css";

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
    fetchGames(); // Refresh the list from MongoDB
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

  // Get image source - prefer imageUrl, fallback to img
  const getImageSrc = (game) => {
    if (game.imageUrl) return game.imageUrl;
    if (game.img) return game.img;
    return "/images/placeholder.jpg"; // fallback
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
        {loading && <p>Loading games from MongoDB...</p>}
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
                    <img 
                      src={getImageSrc(game)} 
                      alt={game.title}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = "/images/placeholder.jpg";
                      }}
                    />
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

## 🎯 Key Changes

1. **Added `imageUrl` field** to form state and validation
2. **Updated validation** to check `imageUrl` pattern (full URL or relative path)
3. **Display logic** uses `imageUrl` first, falls back to `img` if needed
4. **Form includes both fields** for backward compatibility
5. **All CRUD operations** work with MongoDB and update state reactively

## ✅ What Works

- ✅ POST: New games with `imageUrl` are saved to MongoDB
- ✅ PUT: Editing updates `imageUrl` in MongoDB
- ✅ DELETE: Games are removed from MongoDB
- ✅ List auto-updates after all operations (no page refresh)
- ✅ Images display using `imageUrl` field
- ✅ Client-side validation matches Joi schema

