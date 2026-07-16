require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fedex_smart',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function addActivitiesTable() {
  const client = await pool.connect();
  try {
    console.log('Starting migration to add activities table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        activity_date DATE,
        activity_type VARCHAR(100) DEFAULT 'activity',
        image_url TEXT,
        link TEXT,
        is_featured BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created activities table.');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activities_featured ON activities(is_featured);
    `);
    console.log('Created indexes for activities table.');

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    client.release();
    pool.end();
  }
}

addActivitiesTable();
