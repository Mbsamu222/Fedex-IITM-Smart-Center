const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    // Auto-update outdated placeholder phone number if present in database
    await pool.query(
      "UPDATE site_settings SET setting_value = '044 2257 9668', updated_at = CURRENT_TIMESTAMP WHERE setting_key = 'contact_phone' AND (setting_value = '044 2257 9999' OR setting_value LIKE '%9999%')"
    ).catch(() => {});

    const result = await pool.query('SELECT * FROM site_settings ORDER BY id ASC');
    const settings = {};
    result.rows.forEach(row => { 
      let val = row.setting_value;
      if (row.setting_key === 'contact_phone' && (!val || val === '044 2257 9999' || val.includes('9999'))) {
        val = '044 2257 9668';
      }
      settings[row.setting_key] = val; 
    });
    if (!settings.contact_phone) {
      settings.contact_phone = '044 2257 9668';
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/settings
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP',
        [key, value]
      );
    }
    res.json({ message: 'Settings updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
