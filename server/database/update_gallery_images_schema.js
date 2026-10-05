const pool = require('../config/db');

async function migrate() {
  try {
    console.log('Migrating gallery_images table for multi-image support...');
    await pool.query(`
      ALTER TABLE gallery_images 
      ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('✅ Added "images" JSONB column to gallery_images.');

    // Populate images column for existing records if empty
    await pool.query(`
      UPDATE gallery_images 
      SET images = json_build_array(image_url)::jsonb 
      WHERE (images IS NULL OR images = '[]'::jsonb) AND image_url IS NOT NULL AND image_url != '';
    `);
    console.log('✅ Synchronized existing image_url to images array for all records.');

    const res = await pool.query('SELECT id, caption, image_url, images FROM gallery_images LIMIT 5;');
    console.log('Sample rows:', res.rows);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

migrate();
