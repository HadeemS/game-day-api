/**
 * GameForm Component
 * Professional React component for creating and editing games
 * Integrates with Render API for persistent data storage
 */

const { useState, useEffect, useCallback } = React;

/**
 * API Service Layer
 * Centralized API communication with error handling
 */
const GameAPI = {
  baseURL: window.__GAME_DAY_API_BASE__ || window.location.origin,

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({ error: 'Invalid JSON response' }));

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Server error (${response.status})`;
        const details = data.details ? data.details.join('. ') : '';
        throw new Error(details ? `${errorMessage}. ${details}` : errorMessage);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Could not reach ${this.baseURL}. Check if server is running.`);
      }
      throw error;
    }
  },

  async getAll() {
    return this.request('/api/games');
  },

  async getById(id) {
    return this.request(`/api/games/${id}`);
  },

  async create(gameData) {
    const result = await this.request('/api/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
    return result.game || result;
  },

  async update(id, gameData) {
    const result = await this.request(`/api/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
    return result.game || result;
  },

  async delete(id) {
    return this.request(`/api/games/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Validation Schema
 * Mirrors server-side Joi validation
 */
const validateGame = (data) => {
  const errors = {};

  // Title: 3-80 characters
  if (!data.title || data.title.trim().length < 3 || data.title.trim().length > 80) {
    errors.title = 'Title must be 3-80 characters';
  }

  // League: must be one of valid values
  const validLeagues = ['NFL', 'NBA', 'NCAA Football', 'MLB', 'MLS'];
  if (!data.league || !validLeagues.includes(data.league)) {
    errors.league = 'League must be one of: NFL, NBA, NCAA Football, MLB, MLS';
  }

  // Date: YYYY-MM-DD format
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.date = 'Date must be in YYYY-MM-DD format';
  }

  // Time: HH:MM format
  if (!data.time || !/^\d{2}:\d{2}$/.test(data.time)) {
    errors.time = 'Time must be in HH:MM format';
  }

  // Venue: 2-80 characters
  if (!data.venue || data.venue.trim().length < 2 || data.venue.trim().length > 80) {
    errors.venue = 'Venue must be 2-80 characters';
  }

  // City: 2-80 characters
  if (!data.city || data.city.trim().length < 2 || data.city.trim().length > 80) {
    errors.city = 'City must be 2-80 characters';
  }

  // Price: integer 0-10000
  const priceNum = Number(data.price);
  if (isNaN(priceNum) || !Number.isInteger(priceNum) || priceNum < 0 || priceNum > 10000) {
    errors.price = 'Price must be an integer between 0 and 10000';
  }

  // Image path: must start with http://, https://, or /
  if (!data.img || !/^(https?:\/\/|\/)/i.test(data.img.trim())) {
    errors.img = 'Image path must start with http://, https://, or /';
  }

  // Image URL: full URL or relative path with extension
  if (!data.imageUrl || !/^(https?:\/\/[^\s]+|\/[^\s]+\.(png|jpg|jpeg|webp|gif)$)/i.test(data.imageUrl.trim())) {
    errors.imageUrl = 'Image URL must be a full URL (http:// or https://) or a relative path ending with .png, .jpg, .jpeg, .webp, or .gif';
  }

  // Summary: 5-240 characters
  if (!data.summary || data.summary.trim().length < 5 || data.summary.trim().length > 240) {
    errors.summary = 'Summary must be 5-240 characters';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * GameForm Component
 * Handles both create and edit operations
 */
const GameForm = ({ game = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    league: 'NBA',
    date: '',
    time: '',
    venue: '',
    city: '',
    price: 0,
    img: '',
    imageUrl: '',
    summary: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });

  // Populate form when editing
  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || '',
        league: game.league || 'NBA',
        date: game.date || '',
        time: game.time || '',
        venue: game.venue || '',
        city: game.city || '',
        price: game.price || 0,
        img: game.img || '',
        imageUrl: game.imageUrl || '',
        summary: game.summary || '',
      });
    }
  }, [game]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Math.floor(Number(value) || 0) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatusMessage({ type: null, text: '' });

    // Client-side validation
    const validationErrors = validateGame(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      setStatusMessage({
        type: 'error',
        text: 'Please fix the errors below',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const trimmedData = {
        title: formData.title.trim(),
        league: formData.league,
        date: formData.date,
        time: formData.time,
        venue: formData.venue.trim(),
        city: formData.city.trim(),
        price: formData.price,
        img: formData.img.trim(),
        imageUrl: formData.imageUrl.trim(),
        summary: formData.summary.trim(),
      };

      if (game) {
        // Update existing game
        await GameAPI.update(game._id, trimmedData);
        setStatusMessage({
          type: 'success',
          text: 'Game updated successfully!',
        });
      } else {
        // Create new game
        await GameAPI.create(trimmedData);
        setStatusMessage({
          type: 'success',
          text: 'Game created successfully!',
        });
        // Reset form
        setFormData({
          title: '',
          league: 'NBA',
          date: '',
          time: '',
          venue: '',
          city: '',
          price: 0,
          img: '',
          imageUrl: '',
          summary: '',
        });
      }

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage({ type: null, text: '' });
      }, 3000);

      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error.message || 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      <div className={`field ${errors.title ? 'field--error' : ''}`}>
        <label>
          <span>Matchup Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Lakers vs Celtics"
            required
          />
        </label>
        {errors.title && <div className="field-error">{errors.title}</div>}
      </div>

      <div className={`field ${errors.league ? 'field--error' : ''}`}>
        <label>
          <span>League</span>
          <select name="league" value={formData.league} onChange={handleChange} required>
            <option value="NBA">NBA</option>
            <option value="NFL">NFL</option>
            <option value="NCAA Football">NCAA Football</option>
            <option value="MLB">MLB</option>
            <option value="MLS">MLS</option>
          </select>
        </label>
        {errors.league && <div className="field-error">{errors.league}</div>}
      </div>

      <div className={`field ${errors.date ? 'field--error' : ''}`}>
        <label>
          <span>Date</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        {errors.date && <div className="field-error">{errors.date}</div>}
      </div>

      <div className={`field ${errors.time ? 'field--error' : ''}`}>
        <label>
          <span>Time</span>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        {errors.time && <div className="field-error">{errors.time}</div>}
      </div>

      <div className={`field ${errors.venue ? 'field--error' : ''}`}>
        <label>
          <span>Venue</span>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Crypto.com Arena"
            required
          />
        </label>
        {errors.venue && <div className="field-error">{errors.venue}</div>}
      </div>

      <div className={`field ${errors.city ? 'field--error' : ''}`}>
        <label>
          <span>City</span>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Los Angeles, CA"
            required
          />
        </label>
        {errors.city && <div className="field-error">{errors.city}</div>}
      </div>

      <div className={`field ${errors.price ? 'field--error' : ''}`}>
        <label>
          <span>Starting Price (USD)</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            max="10000"
            step="1"
            required
          />
        </label>
        {errors.price && <div className="field-error">{errors.price}</div>}
      </div>

      <div className={`field field--full ${errors.img ? 'field--error' : ''}`}>
        <label>
          <span>Image Path</span>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="/images/usc-vs-clemson.jpg"
            required
          />
        </label>
        {errors.img && <div className="field-error">{errors.img}</div>}
      </div>

      <div className={`field field--full ${errors.imageUrl ? 'field--error' : ''}`}>
        <label>
          <span>Image URL</span>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/images/usc-vs-clemson.jpg or https://example.com/image.jpg"
            required
          />
        </label>
        {errors.imageUrl && <div className="field-error">{errors.imageUrl}</div>}
      </div>

      <div className={`field field--full ${errors.summary ? 'field--error' : ''}`}>
        <label>
          <span>Summary</span>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="What makes this matchup must-see TV?"
            rows="3"
            required
          />
        </label>
        {errors.summary && <div className="field-error">{errors.summary}</div>}
      </div>

      <div className="form-footer">
        {statusMessage.type && (
          <div className={`status-pill status-pill--${statusMessage.type === 'error' ? 'error' : 'success'}`}>
            {statusMessage.text}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{ background: 'rgba(148, 163, 184, 0.2)', color: 'var(--text)' }}
            >
              Cancel
            </button>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : game ? 'Update Game' : 'Share this game'}
          </button>
        </div>
      </div>
    </form>
  );
};

/**
 * GameList Component
 * Displays games with edit and delete functionality
 */
const GameList = ({ games, onEdit, onDelete, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) {
      return;
    }

    setDeletingId(gameId);
    try {
      await GameAPI.delete(gameId);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      alert(`Failed to delete game: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const resolveImageUrl = (game) => {
    const candidate = game.imageUrl || game.img || '';
    if (!candidate) return '';
    const lower = candidate.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
      return candidate;
    }
    return `${GameAPI.baseURL}${candidate}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return isNaN(d) ? dateStr : d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatMoney = (n) => {
    return '$' + Number(n || 0).toLocaleString('en-US');
  };

  if (!games || games.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        <p>No games found. Create your first game above!</p>
      </div>
    );
  }

  const sortedGames = [...games].sort(
    (a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
  );

  return (
    <div className="games-grid">
      {sortedGames.map((game) => (
        <article key={game._id} className="game-card">
          <div className="game-card__media">
            <img
              src={resolveImageUrl(game)}
              alt={game.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23111827" width="400" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="system-ui" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
              }}
            />
            <span className="game-card__badge">{game.league}</span>
          </div>
          <div className="game-card__body">
            <h3>{game.title}</h3>
            <p className="game-card__datetime">
              {formatDate(game.date)} at {game.time}
            </p>
            <p className="game-card__location">
              {game.venue}, {game.city}
            </p>
            <p className="game-card__summary">{game.summary}</p>
            <p className="game-card__price">{formatMoney(game.price)}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => onEdit(game)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(game._id)}
                disabled={deletingId === game._id}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  background: 'rgba(248, 113, 113, 0.2)',
                  color: '#fda4af',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                }}
              >
                {deletingId === game._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

/**
 * Main App Component
 * Orchestrates GameForm and GameList
 */
const App = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGame, setEditingGame] = useState(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GameAPI.getAll();
      setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch games:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleFormSuccess = () => {
    setEditingGame(null);
    fetchGames();
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    // Scroll to form
    document.querySelector('.panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingGame(null);
  };

  return (
    <section className="content-grid">
      <section className="panel">
        <div className="panel__header">
          <h2>{editingGame ? 'Edit Game' : 'Post a marquee matchup'}</h2>
          <p className="muted">
            {editingGame
              ? 'Update the game details below'
              : 'Client-side checks mirror your server rules.'}
          </p>
        </div>
        <GameForm
          game={editingGame}
          onSuccess={handleFormSuccess}
          onCancel={editingGame ? handleCancelEdit : null}
        />
      </section>

      <section className="panel list-panel">
        <div className="panel__header">
          <h2>Upcoming spotlight games</h2>
          <p className="muted">Every time you post, the schedule updates instantly.</p>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <p>Loading games...</p>
          </div>
        ) : error ? (
          <div className="alert">
            <p>Error: {error}</p>
            <button
              type="button"
              onClick={fetchGames}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
            >
              Retry
            </button>
          </div>
        ) : (
          <GameList games={games} onEdit={handleEdit} onDelete={handleFormSuccess} onRefresh={fetchGames} />
        )}
      </section>
    </section>
  );
};

// Export for use in HTML
window.GameForm = GameForm;
window.GameList = GameList;
window.App = App;
window.GameAPI = GameAPI;

