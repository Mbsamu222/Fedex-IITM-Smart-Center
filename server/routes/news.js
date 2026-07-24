const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    let query = 'SELECT * FROM news_updates';
    const params = [];
    if (active === 'true') {
      query += ' WHERE is_active = $1';
      params.push(true);
    }
    query += ' ORDER BY sort_order ASC, published_date DESC, id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/news/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news_updates WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/news
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, published_date, link, image_url, is_active, sort_order } = req.body;
    const result = await pool.query(
      `INSERT INTO news_updates (title, description, published_date, link, image_url, is_active, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, published_date || null, link, image_url, is_active ?? true, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/news/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, published_date, link, image_url, is_active, sort_order } = req.body;
    const result = await pool.query(
      `UPDATE news_updates SET
        title=$1, description=$2, published_date=$3, link=$4, image_url=$5, is_active=$6, sort_order=$7,
        updated_at=CURRENT_TIMESTAMP
       WHERE id=$8 RETURNING *`,
      [title, description, published_date || null, link, image_url, is_active ?? true, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/news/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM news_updates WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
