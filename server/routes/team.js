const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Ensure the is_active column exists and category column is wide enough (idempotent migration).
// This runs once per cold-start, harmlessly on every restart.
(async () => {
  try {
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
    // Back-fill any NULLs so existing rows are visible on the public site
    await pool.query(`
      UPDATE team_members SET is_active = true WHERE is_active IS NULL;
    `);
  } catch (err) {
    console.warn('team: could not ensure columns/constraints:', err.message);
  }
})();

// Helper: run a team query; if it fails because the column is missing, retry without is_active filter
async function queryTeam(conditions, params) {
  const base = 'SELECT * FROM team_members';
  const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
  const order = ' ORDER BY sort_order ASC';
  try {
    return await pool.query(base + where + order, params);
  } catch (err) {
    // Column likely missing in this DB – retry without is_active condition
    if (err.message && err.message.includes('is_active')) {
      const safeConditions = conditions.filter(c => !c.includes('is_active'));
      const safeWhere = safeConditions.length > 0 ? ' WHERE ' + safeConditions.join(' AND ') : '';
      return await pool.query(base + safeWhere + order, params);
    }
    throw err;
  }
}

// GET /api/team — public: only returns active members; admin can see all
router.get('/', async (req, res) => {
  try {
    const { category, all } = req.query;
    const params = [];
    const conditions = [];

    if (category) {
      params.push(`%${category.trim()}%`);
      conditions.push(`category ILIKE $${params.length}`);
    }

    // Public requests only see active members unless ?all=true is passed (admin)
    if (all !== 'true') {
      conditions.push(`COALESCE(is_active, true) = true`);
    }

    const result = await queryTeam(conditions, params);
    res.json(result.rows);
  } catch (error) {
    console.error('GET /api/team error:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/team/reorder/batch - batch update sort orders
router.put('/reorder/batch', auth, async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, sort_order }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: 'Orders array is required.' });
    }
    for (const item of orders) {
      if (item.id !== undefined && typeof item.sort_order === 'number') {
        await pool.query('UPDATE team_members SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [item.sort_order, item.id]);
      }
    }
    res.json({ message: 'Orders updated successfully.' });
  } catch (error) {
    console.error('Batch reorder error:', error.message);
    res.status(500).json({ message: 'Server error during reorder.' });
  }
});

// GET /api/team/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_members WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/team
router.post('/', auth, async (req, res) => {
  try {
    const { name, title, department, email, image_url, category, bio, sort_order, is_active } = req.body;
    const categoryStr = Array.isArray(category) ? category.join(', ') : (category || '').trim();
    if (!name || !categoryStr) {
      return res.status(400).json({ message: 'Name and category are required.' });
    }
    const result = await pool.query(
      'INSERT INTO team_members (name, title, department, email, image_url, category, bio, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [name, title, department, email, image_url, categoryStr, bio, sort_order || 0, is_active !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/team/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, title, department, email, image_url, category, bio, sort_order, is_active } = req.body;
    const categoryStr = Array.isArray(category) ? category.join(', ') : (category || '').trim();
    const result = await pool.query(
      'UPDATE team_members SET name=$1, title=$2, department=$3, email=$4, image_url=$5, category=$6, bio=$7, sort_order=$8, is_active=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *',
      [name, title, department, email, image_url, categoryStr, bio, sort_order || 0, is_active !== false, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/team/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
