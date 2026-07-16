const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
app.use(cors({
  origin: (origin, callback) => {
    // No Origin header (same-origin requests, curl, server-to-server) is always allowed.
    // Any *.vercel.app origin is allowed since client and API are served from the same
    // Vercel project (covers the production alias and every preview deployment URL,
    // neither of which match the single VERCEL_URL env var).
    if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[^/]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API responses are dynamic (backed by the database) and must never be
// cached by the browser or Vercel's edge — otherwise admin edits can
// appear stale on reload.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/research-areas', require('./routes/researchAreas'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/events', require('./routes/events'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/team', require('./routes/team'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
