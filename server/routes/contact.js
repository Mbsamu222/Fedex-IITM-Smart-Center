const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/contact - Get contact info
router.get('/', async (req, res) => {
  try {
    const settings = await pool.query(
      "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('contact_phone','contact_email','contact_address')"
    );
    const contactInfo = {};
    settings.rows.forEach(row => { contactInfo[row.setting_key] = row.setting_value; });
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/contact/message - Submit contact form
router.post('/message', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, subject, message]
    );
    res.status(201).json({ message: 'Message sent successfully!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/contact/messages - Admin: get all messages
router.get('/messages', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/contact/messages/:id/read - Mark as read
router.put('/messages/:id/read', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/contact/messages/:id
router.delete('/messages/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
