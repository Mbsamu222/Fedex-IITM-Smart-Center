const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/research-areas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM research_areas ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/research-areas/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM research_areas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/research-areas
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, icon, image_url, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO research_areas (title, description, icon, image_url, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, description, icon, image_url, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/research-areas/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, icon, image_url, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE research_areas SET title=$1, description=$2, icon=$3, image_url=$4, sort_order=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *',
      [title, description, icon, image_url, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/research-areas/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM research_areas WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
