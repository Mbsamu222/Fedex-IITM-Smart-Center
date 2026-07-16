const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Load .env from server dir

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Adding new columns to projects table...');
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Ongoing',
      ADD COLUMN IF NOT EXISTS content TEXT,
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE,
      ADD COLUMN IF NOT EXISTS header_image_url TEXT,
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS listed_in_research_page BOOLEAN DEFAULT true;
    `);

    // Generate slugs for existing projects
    console.log('Generating slugs for existing projects...');
    const res = await client.query('SELECT id, title FROM projects WHERE slug IS NULL');
    for (let row of res.rows) {
      let slug = row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!slug) slug = `project-${row.id}`;
      // Basic uniqueness handling
      let uniqueSlug = slug;
      let count = 1;
      let exists = true;
      while (exists) {
        const check = await client.query('SELECT id FROM projects WHERE slug = $1 AND id != $2', [uniqueSlug, row.id]);
        if (check.rows.length > 0) {
          uniqueSlug = `${slug}-${count}`;
          count++;
        } else {
          exists = false;
        }
      }
      await client.query('UPDATE projects SET slug = $1 WHERE id = $2', [uniqueSlug, row.id]);
    }

    console.log('Creating project_people table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_people (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES projects(id) ON DELETE CASCADE,
        person_id INT REFERENCES team_members(id) ON DELETE CASCADE,
        role VARCHAR(100),
        sort_order INT DEFAULT 0
      );
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
