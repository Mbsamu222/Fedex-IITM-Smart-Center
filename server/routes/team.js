const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/team — public: only returns active members; admin can see all
router.get('/', async (req, res) => {
  try {
    const { category, all } = req.query;
    const params = [];
    let conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    // Public requests only see active members unless ?all=true is passed (admin)
    if (all !== 'true') {
      conditions.push(`is_active = true`);
    }

    let query = 'SELECT * FROM team_members';
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY sort_order ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/team/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_members WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/team
router.post('/', auth, async (req, res) => {
  try {
    const { name, title, department, email, image_url, category, bio, sort_order, is_active } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required.' });
    }
    const result = await pool.query(
      'INSERT INTO team_members (name, title, department, email, image_url, category, bio, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [name, title, department, email, image_url, category, bio, sort_order || 0, is_active !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/team/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, title, department, email, image_url, category, bio, sort_order, is_active } = req.body;
    const result = await pool.query(
      'UPDATE team_members SET name=$1, title=$2, department=$3, email=$4, image_url=$5, category=$6, bio=$7, sort_order=$8, is_active=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *',
      [name, title, department, email, image_url, category, bio, sort_order || 0, is_active !== false, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/team/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
