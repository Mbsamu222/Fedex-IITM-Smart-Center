const pool = require('../config/db');

async function runMigration() {
  try {
    console.log('Checking gallery_images table...');

    // Add date column if it does not exist
    await pool.query(`
      ALTER TABLE gallery_images 
      ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
    `);
    console.log('✅ Added "date" column to gallery_images table.');

    // Add index on date
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_gallery_date ON gallery_images(date);
    `);
    console.log('✅ Created index on gallery_images(date).');

    // Query existing columns to verify
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gallery_images';
    `);
    console.log('Current gallery_images columns:', res.rows);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running gallery migration:', err);
  } finally {
    await pool.end();
  }
}

runMigration();
