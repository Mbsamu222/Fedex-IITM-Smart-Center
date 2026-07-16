const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const { category, published } = req.query;
    let query = 'SELECT * FROM blogs';
    const conditions = [];
    const params = [];
    let paramCount = 0;
    if (published !== 'false') { paramCount++; conditions.push(`is_published = $${paramCount}`); params.push(true); }
    if (category) { paramCount++; conditions.push(`category = $${paramCount}`); params.push(category); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY published_date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/blogs/all - admin gets all including unpublished
router.get('/all', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY published_date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/blogs/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/blogs
router.post('/', auth, async (req, res) => {
  try {
    const { title, excerpt, content, author, category, image_url, published_date, is_published } = req.body;
    const result = await pool.query(
      'INSERT INTO blogs (title, excerpt, content, author, category, image_url, published_date, is_published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, excerpt, content, author, category, image_url, published_date || new Date(), is_published !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/blogs/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, excerpt, content, author, category, image_url, published_date, is_published } = req.body;
    const result = await pool.query(
      'UPDATE blogs SET title=$1, excerpt=$2, content=$3, author=$4, category=$5, image_url=$6, published_date=$7, is_published=$8, updated_at=CURRENT_TIMESTAMP WHERE id=$9 RETURNING *',
      [title, excerpt, content, author, category, image_url, published_date, is_published !== false, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/blogs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
