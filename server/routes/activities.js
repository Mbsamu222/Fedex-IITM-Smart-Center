const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/activities
router.get('/', async (req, res) => {
  try {
    const { featured, type } = req.query;
    let query = 'SELECT * FROM activities';
    const conditions = [];
    const params = [];
    let paramCount = 0;
    if (featured === 'true') { paramCount++; conditions.push(`is_featured = $${paramCount}`); params.push(true); }
    if (type) { paramCount++; conditions.push(`activity_type = $${paramCount}`); params.push(type); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY sort_order ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/activities/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/activities
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, description, activity_date, activity_type, image_url, link, is_featured, sort_order,
      status, start_date, end_date, expiration_date, location, contact_email, contact_phone, external_url 
    } = req.body;
    const result = await pool.query(
      `INSERT INTO activities (
        title, description, activity_date, activity_type, image_url, link, is_featured, sort_order,
        status, start_date, end_date, expiration_date, location, contact_email, contact_phone, external_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [
        title, description, activity_date || null, activity_type || 'Announcement', image_url, link, is_featured || false, sort_order || 0,
        status || 'Active', start_date || null, end_date || null, expiration_date || null, location, contact_email, contact_phone, external_url || link
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/activities/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      title, description, activity_date, activity_type, image_url, link, is_featured, sort_order,
      status, start_date, end_date, expiration_date, location, contact_email, contact_phone, external_url 
    } = req.body;
    const result = await pool.query(
      `UPDATE activities SET 
        title=$1, description=$2, activity_date=$3, activity_type=$4, image_url=$5, link=$6, is_featured=$7, sort_order=$8,
        status=$9, start_date=$10, end_date=$11, expiration_date=$12, location=$13, contact_email=$14, contact_phone=$15, external_url=$16,
        updated_at=CURRENT_TIMESTAMP 
      WHERE id=$17 RETURNING *`,
      [
        title, description, activity_date || null, activity_type || 'Announcement', image_url, link, is_featured || false, sort_order || 0,
        status || 'Active', start_date || null, end_date || null, expiration_date || null, location, contact_email, contact_phone, external_url || link,
        req.params.id
      ]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/activities/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
