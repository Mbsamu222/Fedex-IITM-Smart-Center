const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Auto-migrate helper to ensure columns exist in remote database (Vercel Neon/Postgres)
let tableChecked = false;
const ensureGalleryTableSchema = async () => {
  if (tableChecked) return;
  try {
    // Add date column as VARCHAR(100) if not exists
    await pool.query(`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS date VARCHAR(100);`);
    
    // Add images column as JSONB if not exists
    await pool.query(`ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;`);

    // If date was created as strict DATE type previously, convert it to VARCHAR(100) to allow Month/Year or Day/Month/Year
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

// Helper to normalize images array
const parseImages = (row) => {
  let images = [];
  if (Array.isArray(row.images)) {
    images = row.images;
  } else if (typeof row.images === 'string') {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) images = parsed;
    } catch (e) {
      if (row.images.trim()) images = [row.images];
    }
  }
  // If images array is empty but image_url exists, include image_url
  if (images.length === 0 && row.image_url) {
    images = [row.image_url];
  }
  return { ...row, images };
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
    const rows = result.rows.map(parseImages);
    res.json(rows);
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// POST /api/gallery
router.post('/', auth, async (req, res) => {
  try {
    await ensureGalleryTableSchema();
    const { image_url, caption, category, date, sort_order, images } = req.body;
    
    let imagesArr = Array.isArray(images) ? images : [];
    if (imagesArr.length === 0 && image_url) {
      imagesArr = [image_url];
    }
    const mainImageUrl = image_url || (imagesArr.length > 0 ? imagesArr[0] : '');
    const imagesJson = JSON.stringify(imagesArr);

    const result = await pool.query(
      'INSERT INTO gallery_images (image_url, caption, category, date, sort_order, images) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [mainImageUrl, caption, category, date || null, sort_order || 0, imagesJson]
    );
    res.status(201).json(parseImages(result.rows[0]));
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// PUT /api/gallery/:id
router.put('/:id', auth, async (req, res) => {
  try {
    await ensureGalleryTableSchema();
    const { image_url, caption, category, date, sort_order, images } = req.body;

    let imagesArr = Array.isArray(images) ? images : [];
    if (imagesArr.length === 0 && image_url) {
      imagesArr = [image_url];
    }
    const mainImageUrl = image_url || (imagesArr.length > 0 ? imagesArr[0] : '');
    const imagesJson = JSON.stringify(imagesArr);

    const result = await pool.query(
      'UPDATE gallery_images SET image_url=$1, caption=$2, category=$3, date=$4, sort_order=$5, images=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
      [mainImageUrl, caption, category, date || null, sort_order || 0, imagesJson, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(parseImages(result.rows[0]));
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
