const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/hero - Get active hero sections
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero_sections WHERE is_active = true ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/hero/all - Get all hero sections (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero_sections ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/hero - Create hero section
router.post('/', auth, async (req, res) => {
  try {
    const { title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, image_url, title_highlight, floating_tag, floating_text, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO hero_sections (title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, image_url, title_highlight, floating_tag, floating_text, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, image_url, title_highlight, floating_tag, floating_text, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/hero/:id - Update hero section
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, image_url, title_highlight, floating_tag, floating_text, is_active } = req.body;
    const result = await pool.query(
      `UPDATE hero_sections SET title=$1, subtitle=$2, description=$3, cta_primary_text=$4, cta_primary_link=$5, cta_secondary_text=$6, cta_secondary_link=$7, image_url=$8, title_highlight=$9, floating_tag=$10, floating_text=$11, is_active=$12, updated_at=CURRENT_TIMESTAMP WHERE id=$13 RETURNING *`,
      [title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, image_url, title_highlight, floating_tag, floating_text, is_active, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/hero/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM hero_sections WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
