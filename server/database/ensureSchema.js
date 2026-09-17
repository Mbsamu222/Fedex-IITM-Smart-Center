const pool = require('../config/db');

let isSchemaEnsured = false;

async function ensureSchema() {
  if (isSchemaEnsured) return;
  try {
    // 1. Events Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        event_type VARCHAR(100) DEFAULT 'event',
        image_url TEXT,
        link TEXT,
        is_featured BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE,
      ADD COLUMN IF NOT EXISTS time VARCHAR(100),
      ADD COLUMN IF NOT EXISTS location VARCHAR(255),
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
      ADD COLUMN IF NOT EXISTS content TEXT,
      ADD COLUMN IF NOT EXISTS speaker_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS speaker_designation VARCHAR(255),
      ADD COLUMN IF NOT EXISTS speaker_image TEXT;
    `);

    // Backfill start_date and slug if missing
    try {
      await pool.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'events' AND column_name = 'event_date'
          ) THEN
            UPDATE events SET start_date = event_date WHERE start_date IS NULL;
          END IF;
        END $$;
      `);
      await pool.query(`
        UPDATE events 
        SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')) 
        WHERE slug IS NULL OR slug = '';
      `);
    } catch (e) {
      console.warn('Events data backfill warning:', e.message);
    }

    // 2. Team Members
    await pool.query(`
      ALTER TABLE team_members 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
    await pool.query(`
      ALTER TABLE team_members 
      ALTER COLUMN category TYPE VARCHAR(255);
    `);
    await pool.query(`
      ALTER TABLE team_members 
      DROP CONSTRAINT IF EXISTS team_members_category_check;
    `);
    await pool.query(`
      UPDATE team_members SET is_active = true WHERE is_active IS NULL;
    `);

    // 3. Gallery Images
    await pool.query(`
      ALTER TABLE gallery_images 
      ADD COLUMN IF NOT EXISTS date VARCHAR(100);
    `);

    // 4. Activities
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        activity_type VARCHAR(100) DEFAULT 'Announcement',
        status VARCHAR(50) DEFAULT 'Active',
        start_date DATE,
        end_date DATE,
        expiration_date DATE,
        location VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        external_url TEXT,
        image_url TEXT,
        link TEXT,
        is_featured BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      ALTER TABLE activities 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active',
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE,
      ADD COLUMN IF NOT EXISTS expiration_date DATE,
      ADD COLUMN IF NOT EXISTS location VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS external_url TEXT;
    `);

    // 5. Projects & Project People
    await pool.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Ongoing',
      ADD COLUMN IF NOT EXISTS content TEXT,
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE,
      ADD COLUMN IF NOT EXISTS header_image_url TEXT,
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS listed_in_research_page BOOLEAN DEFAULT true;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_people (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES projects(id) ON DELETE CASCADE,
        person_id INT REFERENCES team_members(id) ON DELETE CASCADE,
        role VARCHAR(100),
        sort_order INT DEFAULT 0
      );
    `);

    // 6. Publications
    await pool.query(`
      ALTER TABLE publications 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
    `);

    // 7. News Updates
    await pool.query(`
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

    isSchemaEnsured = true;
    console.log('Database schema successfully verified & auto-migrated.');
  } catch (err) {
    console.error('Database auto-migrate notice:', err.message);
  }
}

module.exports = ensureSchema;
