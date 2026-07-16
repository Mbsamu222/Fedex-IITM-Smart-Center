const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/publications
router.get('/', async (req, res) => {
  try {
    const { year, category } = req.query;
    let query = 'SELECT * FROM publications';
    const conditions = [];
    const params = [];
    let paramCount = 0;
    if (year) { paramCount++; conditions.push(`year = $${paramCount}`); params.push(parseInt(year)); }
    if (category) { paramCount++; conditions.push(`category = $${paramCount}`); params.push(category); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY year DESC, id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/publications/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM publications WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/publications
router.post('/', auth, async (req, res) => {
  try {
    const { title, authors, venue, year, abstract, doi_link, pdf_link, category, is_featured, is_published } = req.body;
    const result = await pool.query(
      'INSERT INTO publications (title, authors, venue, year, abstract, doi_link, pdf_link, category, is_featured, is_published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [title, authors, venue, year, abstract, doi_link, pdf_link, category, is_featured ?? false, is_published ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/publications/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, authors, venue, year, abstract, doi_link, pdf_link, category, is_featured, is_published } = req.body;
    const result = await pool.query(
      'UPDATE publications SET title=$1, authors=$2, venue=$3, year=$4, abstract=$5, doi_link=$6, pdf_link=$7, category=$8, is_featured=$9, is_published=$10, updated_at=CURRENT_TIMESTAMP WHERE id=$11 RETURNING *',
      [title, authors, venue, year, abstract, doi_link, pdf_link, category, is_featured ?? false, is_published ?? true, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/publications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM publications WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
