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

      console.log('Adding new columns to events table...');
      await client.query(`
        ALTER TABLE events 
        ADD COLUMN IF NOT EXISTS start_date DATE,
        ADD COLUMN IF NOT EXISTS end_date DATE,
        ADD COLUMN IF NOT EXISTS time VARCHAR(100),
        ADD COLUMN IF NOT EXISTS location VARCHAR(255);
      `);

      console.log('Migrating event_date to start_date...');
      await client.query(`
        UPDATE events SET start_date = event_date WHERE start_date IS NULL;
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
