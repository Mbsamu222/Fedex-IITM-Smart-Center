const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Auto-migrate helper to ensure column exists in remote database (Vercel Neon/Postgres)
let tableChecked = false;
const ensureGalleryTableSchema = async () => {
  if (tableChecked) return;
  try {
    // Add date column as VARCHAR(100) if not exists
    await pool.query(`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS date VARCHAR(100);`);
    
    // If it was created as strict DATE type previously, convert it to VARCHAR(100) to allow Month/Year or Day/Month/Year
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'gallery_images' 
          AND column_name = 'date' 
          AND data_type = 'date'
        ) THEN 
          ALTER TABLE gallery_images ALTER COLUMN date TYPE VARCHAR(100) USING date::text;
        END IF;
      END $$;
    `);
    tableChecked = true;
  } catch (err) {
    console.error('Error auto-migrating gallery_images schema:', err.message);
  }
};

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    await ensureGalleryTableSchema();
    const { category } = req.query;
    let query = 'SELECT * FROM gallery_images';
    const params = [];
    if (category && category !== 'All') {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ' ORDER BY sort_order ASC, id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// POST /api/gallery
router.post('/', auth, async (req, res) => {
  try {
    await ensureGalleryTableSchema();
    const { image_url, caption, category, date, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO gallery_images (image_url, caption, category, date, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [image_url, caption, category, date || null, sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// PUT /api/gallery/:id
router.put('/:id', auth, async (req, res) => {
  try {
    await ensureGalleryTableSchema();
    const { image_url, caption, category, date, sort_order } = req.body;
    const result = await pool.query(
      'UPDATE gallery_images SET image_url=$1, caption=$2, category=$3, date=$4, sort_order=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *',
      [image_url, caption, category, date || null, sort_order || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('PUT /api/gallery error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// DELETE /api/gallery/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM gallery_images WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/gallery error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

module.exports = router;
