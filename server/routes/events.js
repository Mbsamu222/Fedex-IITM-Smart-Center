const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const ensureSchema = require('../database/ensureSchema');

// Auto-migrate helper to ensure columns exist in remote database (Vercel Neon/Postgres)
let eventsSchemaChecked = false;
const ensureEventsTableSchema = async () => {
  if (eventsSchemaChecked) return;
  try {
    await ensureSchema();
    eventsSchemaChecked = true;
  } catch (err) {
    console.error('Error auto-migrating events schema:', err.message);
  }
};

// Helper to sanitize dates (convert empty strings or whitespace to null)
const sanitizeDate = (val) => {
  if (!val || typeof val !== 'string' || val.trim() === '') return null;
  return val.trim();
};

// GET /api/events
router.get('/', async (req, res) => {
  try {
    await ensureEventsTableSchema();
    const { featured, type } = req.query;
    let query = 'SELECT * FROM events';
    const conditions = [];
    const params = [];
    let paramCount = 0;
    if (featured === 'true') { paramCount++; conditions.push(`is_featured = $${paramCount}`); params.push(true); }
    if (type) { paramCount++; conditions.push(`event_type = $${paramCount}`); params.push(type); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY sort_order ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    await ensureEventsTableSchema();
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// GET /api/events/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  try {
    await ensureEventsTableSchema();
    const result = await pool.query('SELECT * FROM events WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get event by slug error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// POST /api/events
router.post('/', auth, async (req, res) => {
  try {
    await ensureEventsTableSchema();
    const { title, description, content, start_date, end_date, time, location, event_type, image_url, link, is_featured, sort_order, slug, speaker_name, speaker_designation, speaker_image } = req.body;
    let finalSlug = slug && typeof slug === 'string' && slug.trim() !== '' ? slug.trim() : null;
    if (!finalSlug) {
      finalSlug = (title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!finalSlug) finalSlug = 'event-' + Date.now();
    }
    
    // Ensure slug is unique
    const slugCheck = await pool.query('SELECT id FROM events WHERE slug = $1', [finalSlug]);
    if (slugCheck.rows.length > 0) {
      finalSlug = finalSlug + '-' + Date.now();
    }

    const cleanStartDate = sanitizeDate(start_date);
    const cleanEndDate = sanitizeDate(end_date);

    const result = await pool.query(
      'INSERT INTO events (title, description, content, start_date, end_date, time, location, event_type, image_url, link, is_featured, sort_order, slug, speaker_name, speaker_designation, speaker_image) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
      [title, description, content || '', cleanStartDate, cleanEndDate, time || null, location || null, event_type || 'event', image_url || null, link || null, is_featured || false, sort_order || 0, finalSlug, speaker_name || null, speaker_designation || null, speaker_image || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// PUT /api/events/:id
router.put('/:id', auth, async (req, res) => {
  try {
    await ensureEventsTableSchema();
    const { title, description, content, start_date, end_date, time, location, event_type, image_url, link, is_featured, sort_order, slug, speaker_name, speaker_designation, speaker_image } = req.body;
    let finalSlug = slug && typeof slug === 'string' && slug.trim() !== '' ? slug.trim() : null;
    if (!finalSlug) {
      finalSlug = (title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!finalSlug) finalSlug = 'event-' + Date.now();
    }
    
    // Ensure slug is unique
    const slugCheck = await pool.query('SELECT id FROM events WHERE slug = $1 AND id != $2', [finalSlug, req.params.id]);
    if (slugCheck.rows.length > 0) {
      finalSlug = finalSlug + '-' + Date.now();
    }

    const cleanStartDate = sanitizeDate(start_date);
    const cleanEndDate = sanitizeDate(end_date);

    const result = await pool.query(
      'UPDATE events SET title=$1, description=$2, content=$3, start_date=$4, end_date=$5, time=$6, location=$7, event_type=$8, image_url=$9, link=$10, is_featured=$11, sort_order=$12, slug=$13, speaker_name=$14, speaker_designation=$15, speaker_image=$16, updated_at=CURRENT_TIMESTAMP WHERE id=$17 RETURNING *',
      [title, description, content || '', cleanStartDate, cleanEndDate, time || null, location || null, event_type || 'event', image_url || null, link || null, is_featured || false, sort_order || 0, finalSlug, speaker_name || null, speaker_designation || null, speaker_image || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await ensureEventsTableSchema();
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

module.exports = router;
