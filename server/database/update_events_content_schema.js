const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fedex_smart',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function updateSchema() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      console.log('Adding slug and content columns to events table...');
      await client.query(`
        ALTER TABLE events 
        ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
        ADD COLUMN IF NOT EXISTS content TEXT;
      `);

      console.log('Migrating existing descriptions to content...');
      await client.query(`
        UPDATE events 
        SET content = description,
            slug = 'event-' || id
        WHERE slug IS NULL;
      `);

      await client.query('COMMIT');
      console.log('Schema update successful!');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Error during schema update transaction:', e);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    pool.end();
  }
}

updateSchema();
