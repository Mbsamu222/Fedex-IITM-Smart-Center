const pool = require('../config/db');

async function updateSchema() {
  const client = await pool.connect();
  try {
    console.log('Beginning publications schema update...');
    await client.query('BEGIN');

    // Add is_featured column
    await client.query(`
      ALTER TABLE publications 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
    `);
    console.log('Added is_featured column');

    // Add is_published column
    await client.query(`
      ALTER TABLE publications 
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
    `);
    console.log('Added is_published column');

    await client.query('COMMIT');
    console.log('Publications schema updated successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating publications schema:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

updateSchema();
