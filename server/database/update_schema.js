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
    await pool.query("ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_category_check;");
    await pool.query("ALTER TABLE team_members ADD CONSTRAINT team_members_category_check CHECK (category IN ('advisory', 'executive', 'center', 'faculty', 'research', 'postdoc'));");
    console.log("Successfully updated team_members constraint.");
  } catch (err) {
    console.error("Error updating constraint:", err);
  } finally {
    await pool.end();
  }
}

run();
