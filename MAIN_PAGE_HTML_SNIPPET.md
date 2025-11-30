# HTML Snippet for Main 242 Home Page

Copy and paste this HTML section into your main 242 portfolio page (`Hadeem-Secka.github.io`).

## 📋 HTML Code

```html
<section class="project-section">
  <h2>Game Day – Final MongoDB Version</h2>
  <p>Full-stack application with React frontend, Express backend, MongoDB database, and Joi validation. Features CRUD operations (Create, Read, Update, Delete) with persistent data storage.</p>
  
  <div class="project-links">
    <div class="project-link-item">
      <strong>Server Code (GitHub):</strong>
      <a href="https://github.com/HadeemS/game-day-api" target="_blank" rel="noopener noreferrer">
        https://github.com/HadeemS/game-day-api
      </a>
    </div>
    
    <div class="project-link-item">
      <strong>Server API (Render):</strong>
      <a href="https://game-day-api-1.onrender.com" target="_blank" rel="noopener noreferrer">
        https://game-day-api-1.onrender.com
      </a>
    </div>
    
    <div class="project-link-item">
      <strong>Client Code (GitHub):</strong>
      <a href="https://github.com/HadeemS/game-day" target="_blank" rel="noopener noreferrer">
        https://github.com/HadeemS/game-day
      </a>
    </div>
    
    <div class="project-link-item">
      <strong>Client Website (Live):</strong>
      <a href="https://hadeems.github.io/game-day/" target="_blank" rel="noopener noreferrer">
        https://hadeems.github.io/game-day/
      </a>
    </div>
  </div>
  
  <div class="project-details">
    <h3>Project Features:</h3>
    <ul>
      <li><strong>Form Location:</strong> On the Games page, click "Add New Game" button to see the form</li>
      <li><strong>List Location:</strong> Games list displays below the form on the same Games page</li>
      <li><strong>Database:</strong> MongoDB Atlas (cloud database) for persistent storage</li>
      <li><strong>Validation:</strong> Joi validation on server, matching client-side validation</li>
      <li><strong>CRUD Operations:</strong> Create (POST), Read (GET), Update (PUT), Delete (DELETE)</li>
      <li><strong>Image Support:</strong> Each game includes an imageUrl field for displaying pictures</li>
    </ul>
  </div>
</section>
```

## 🎨 Optional CSS Styling

If you want to style this section, add this CSS:

```css
.project-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
}

.project-section h2 {
  margin-top: 0;
  color: #f8fafc;
}

.project-links {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
}

.project-link-item {
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
}

.project-link-item strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.project-link-item a {
  color: #7aa2ff;
  text-decoration: none;
  word-break: break-all;
}

.project-link-item a:hover {
  text-decoration: underline;
}

.project-details {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

.project-details h3 {
  margin-top: 0;
  color: #f8fafc;
}

.project-details ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.project-details li {
  margin: 0.5rem 0;
  color: #cbd5e1;
}
```

## 📍 Where to Add This

Add this section to your main 242 portfolio page, ideally:
- In the "Projects" section
- After your other project entries
- Make sure it's clearly visible and easy to find

## ✅ What This Provides

- ✅ Link to server-side GitHub repo
- ✅ Link to Render server URL
- ✅ Link to client-side GitHub repo
- ✅ Link to client-side live website
- ✅ Clear indication of where the form is located
- ✅ Clear indication of where the list is located
- ✅ Information about MongoDB and validation

