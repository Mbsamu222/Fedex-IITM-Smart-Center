require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fedex_smart',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Creating news_updates table if it does not exist...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS news_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        published_date DATE DEFAULT CURRENT_DATE,
        link TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_news_active ON news_updates(is_active);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_news_date ON news_updates(published_date);`);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
