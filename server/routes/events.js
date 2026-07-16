const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/events
router.get('/', async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/events/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/events
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, content, start_date, end_date, time, location, event_type, image_url, link, is_featured, sort_order, slug } = req.body;
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    // Ensure slug is unique
    const slugCheck = await pool.query('SELECT id FROM events WHERE slug = $1', [finalSlug]);
    if (slugCheck.rows.length > 0) {
      finalSlug = finalSlug + '-' + Date.now();
    }

    const result = await pool.query(
      'INSERT INTO events (title, description, content, start_date, end_date, time, location, event_type, image_url, link, is_featured, sort_order, slug) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
      [title, description, content || '', start_date || null, end_date || null, time || null, location || null, event_type || 'event', image_url, link, is_featured || false, sort_order || 0, finalSlug]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/events/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, content, start_date, end_date, time, location, event_type, image_url, link, is_featured, sort_order, slug } = req.body;
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    // Ensure slug is unique
    const slugCheck = await pool.query('SELECT id FROM events WHERE slug = $1 AND id != $2', [finalSlug, req.params.id]);
    if (slugCheck.rows.length > 0) {
      finalSlug = finalSlug + '-' + Date.now();
    }

    const result = await pool.query(
      'UPDATE events SET title=$1, description=$2, content=$3, start_date=$4, end_date=$5, time=$6, location=$7, event_type=$8, image_url=$9, link=$10, is_featured=$11, sort_order=$12, slug=$13, updated_at=CURRENT_TIMESTAMP WHERE id=$14 RETURNING *',
      [title, description, content || '', start_date || null, end_date || null, time || null, location || null, event_type || 'event', image_url, link, is_featured || false, sort_order || 0, finalSlug, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
