const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM gallery_images';
    const params = [];
    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ' ORDER BY sort_order ASC, id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/gallery
router.post('/', auth, async (req, res) => {
  try {
    const { image_url, caption, category, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO gallery_images (image_url, caption, category, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [image_url, caption, category, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/gallery/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { image_url, caption, category, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE gallery_images SET image_url=$1, caption=$2, category=$3, sort_order=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *',
      [image_url, caption, category, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/gallery/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM gallery_images WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
