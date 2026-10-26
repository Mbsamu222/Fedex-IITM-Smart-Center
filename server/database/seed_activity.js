require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

async function seedActivityAnnouncement() {
  try {
    const existing = await pool.query("SELECT id FROM activities WHERE activity_type = 'Announcement' AND status = 'Active'");
    if (existing.rowCount === 0) {
      const res = await pool.query(`
        INSERT INTO activities (
          title, description, activity_type, status, start_date, end_date, location, external_url, image_url, is_featured, sort_order
        ) VALUES (
          'Admissions Open: Executive Certificate Program in Agentic AI & GenAI for Logistics',
          'The IIT Madras FedEx SMART Center invites applications for the upcoming cohort of our flagship certificate program. Learn agentic workflows, multi-agent simulation, and predictive supply chain optimization directly from IIT Madras professors and FedEx AI specialists.',
          'Announcement',
          'Active',
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '60 days',
          'IIT Madras / Online Hybrid',
          'https://code.iitm.ac.in',
          '/uploads/hero_predictive_intelligence.png',
          true,
          0
        ) RETURNING id, title, activity_type, status;
      `);
      console.log('Inserted activity announcement:', res.rows[0]);
    } else {
      console.log('Active announcement already exists with id:', existing.rows[0].id);
    }
  } catch (err) {
    console.error('Error inserting activity announcement:', err);
  } finally {
    pool.end();
  }
}

seedActivityAnnouncement();
