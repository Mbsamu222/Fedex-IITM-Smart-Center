const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'fedex_smart_center',
      password: process.env.DB_PASSWORD || 'admin123',
      port: process.env.DB_PORT || 5432,
    });

async function updateSchema() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      console.log('Adding speaker columns to events table...');
      await client.query(`
        ALTER TABLE events 
        ADD COLUMN IF NOT EXISTS speaker_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS speaker_designation VARCHAR(255),
        ADD COLUMN IF NOT EXISTS speaker_image TEXT;
      `);

      await client.query('COMMIT');
      console.log('Schema update for events speaker columns successful!');
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
