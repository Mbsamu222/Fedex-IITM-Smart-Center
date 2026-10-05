const pool = require('../config/db');

async function updateDbContent() {
  try {
    console.log('Running database text updates for "IIT Madras-led FedEx SMART Center"...');
    
    // Update site_settings
    const settingsRes = await pool.query(`
      UPDATE site_settings 
      SET setting_value = REPLACE(setting_value, 'IIT Madras-led FedEx SMART Center', 'IITM FedEx SMART Center')
      WHERE setting_value LIKE '%IIT Madras-led FedEx SMART Center%'
      RETURNING *;
    `);
    console.log(`Updated ${settingsRes.rowCount} row(s) in site_settings`);

    // Update events
    const eventsRes = await pool.query(`
      UPDATE events 
      SET description = REPLACE(description, 'IIT Madras-led FedEx SMART Center', 'IITM FedEx SMART Center')
      WHERE description LIKE '%IIT Madras-led FedEx SMART Center%'
      RETURNING *;
    `);
    console.log(`Updated ${eventsRes.rowCount} row(s) in events`);

    const eventsRes2 = await pool.query(`
      UPDATE events 
      SET description = REPLACE(description, 'IIT Madras-led FedEx SMART Seminar Series', 'IITM FedEx SMART Seminar Series')
      WHERE description LIKE '%IIT Madras-led FedEx SMART Seminar Series%'
      RETURNING *;
    `);
    console.log(`Updated ${eventsRes2.rowCount} row(s) in events (Seminar Series)`);

    // Update activities
    const actRes = await pool.query(`
      UPDATE activities 
      SET description = REPLACE(description, 'IIT Madras-led FedEx SMART Center', 'IITM FedEx SMART Center')
      WHERE description LIKE '%IIT Madras-led FedEx SMART Center%'
      RETURNING *;
    `);
    console.log(`Updated ${actRes.rowCount} row(s) in activities`);

    // Update gallery_images
    const galleryRes = await pool.query(`
      UPDATE gallery_images 
      SET caption = REPLACE(caption, 'IIT Madras-led FedEx SMART Center', 'IITM FedEx SMART Center')
      WHERE caption LIKE '%IIT Madras-led FedEx SMART Center%'
      RETURNING *;
    `);
    console.log(`Updated ${galleryRes.rowCount} row(s) in gallery_images`);

    console.log('✅ DB text updates completed successfully.');
  } catch (err) {
    console.error('Error updating DB content:', err);
  } finally {
    await pool.end();
  }
}

updateDbContent();
