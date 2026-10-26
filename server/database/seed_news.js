require('dotenv').config({ path: '../.env' });
const pool = require('../config/db');

async function seedNews() {
  try {
    const check = await pool.query('SELECT count(*) FROM news_updates');
    console.log('Current count:', check.rows[0].count);
    if (parseInt(check.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO news_updates (title, description, published_date, link, image_url, is_active, sort_order)
        VALUES 
        ('Call for Applications: FedEx SMART GDC I-NCUBATE Startup Bootcamp', 'IIT Madras FedEx SMART Center and GDC have launched an 8-week intensive enablement program for high-potential startups in logistics and supply chain. Applications are now open for early-stage innovators (TRL 3-5).', CURRENT_DATE, '/events/slug/call-for-applications', '/uploads/hero_supply_chain.png', true, 1),
        ('Batch 2 Launch: AI Agents & GenAI for Enterprise Transformation', 'Applications are now open for Batch 2 of our flagship 3-month online certificate program offered jointly by CODE IIT Madras and the FedEx SMART Center. Featuring 10 modules, live weekend sessions, and hands-on GenAI tool experience.', CURRENT_DATE, '/events', '/uploads/hero_predictive_intelligence.png', true, 2),
        ('National Logistics Digital Twin Research Fellowship 2026', 'Applications invited for research scholars and postdoctoral fellows to work on cutting-edge freight network simulation and multi-modal transport optimization models at IIT Madras.', CURRENT_DATE, '/activities', '/uploads/hero_freight_network.png', true, 3);
      `);
      console.log('Sample news announcements inserted successfully.');
    } else {
      console.log('news_updates already has records.');
    }
  } catch (err) {
    console.error('Error seeding news:', err);
  } finally {
    pool.end();
  }
}

seedNews();
