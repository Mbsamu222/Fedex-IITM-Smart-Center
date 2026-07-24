-- FedEx SMART Center Database Schema
-- PostgreSQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS news_updates CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS research_areas CASCADE;
DROP TABLE IF EXISTS stats CASCADE;
DROP TABLE IF EXISTS hero_sections CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Admin Users
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hero Sections
CREATE TABLE hero_sections (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_primary_text VARCHAR(255),
  cta_primary_link VARCHAR(255),
  cta_secondary_text VARCHAR(255),
  cta_secondary_link VARCHAR(255),
  image_url TEXT,
  title_highlight VARCHAR(255),
  floating_tag VARCHAR(255),
  floating_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats / Metrics
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(50) NOT NULL,
  suffix VARCHAR(20) DEFAULT '',
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research Areas
CREATE TABLE research_areas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  research_area_id INT REFERENCES research_areas(id) ON DELETE SET NULL,
  image_url TEXT,
  case_study_link TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE events (
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

-- Activities
CREATE TABLE activities (
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
  activity_date DATE,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  image_url TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Publications
CREATE TABLE publications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT,
  venue VARCHAR(255),
  year INT,
  abstract TEXT,
  doi_link TEXT,
  pdf_link TEXT,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  department VARCHAR(255),
  email VARCHAR(255),
  image_url TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('advisory', 'executive', 'center', 'faculty', 'research', 'postdoc')),
  bio TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  category VARCHAR(100),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News & Updates (homepage announcement popup)
CREATE TABLE news_updates (
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

-- Contact Form Messages
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings (key-value store)
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_projects_research_area ON projects(research_area_id);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_activities_date ON activities(activity_date);
CREATE INDEX idx_activities_featured ON activities(is_featured);
CREATE INDEX idx_blogs_published ON blogs(is_published);
CREATE INDEX idx_blogs_date ON blogs(published_date);
CREATE INDEX idx_publications_year ON publications(year);
CREATE INDEX idx_team_category ON team_members(category);
CREATE INDEX idx_gallery_category ON gallery_images(category);
CREATE INDEX idx_contact_read ON contact_messages(is_read);
CREATE INDEX idx_news_active ON news_updates(is_active);
CREATE INDEX idx_news_date ON news_updates(published_date);
