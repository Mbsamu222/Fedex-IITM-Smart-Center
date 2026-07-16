const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stats ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/stats
router.post('/', auth, async (req, res) => {
  try {
    const { label, value, suffix, icon, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO stats (label, value, suffix, icon, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [label, value, suffix || '', icon, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/stats/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { label, value, suffix, icon, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE stats SET label=$1, value=$2, suffix=$3, icon=$4, sort_order=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *',
      [label, value, suffix || '', icon, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/stats/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM stats WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
