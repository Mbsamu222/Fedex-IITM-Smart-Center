const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    // Add is_active column to team_members (defaults to true so all existing members stay visible)
    await pool.query(`
      ALTER TABLE team_members
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
    console.log('✅ Added is_active column to team_members table (existing members set to active by default).');

    // Add index for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_team_is_active ON team_members(is_active);
    `);
    console.log('✅ Created index on team_members(is_active).');
  } catch (err) {
    console.error('❌ Error updating team_members schema:', err);
  } finally {
    await pool.end();
  }
}

run();
