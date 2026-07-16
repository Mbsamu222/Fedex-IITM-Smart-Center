const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Helper to generate slug
const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    let query = 'SELECT p.*, r.title as research_area_name FROM projects p LEFT JOIN research_areas r ON p.research_area_id = r.id';
    const params = [];
    
    // For non-admin (we don't have a way to check easily here without breaking public api, so we'll just return all and let frontend filter, or we can filter if a specific query param like public=true is passed. Let's just pass all and frontend will filter for now, or add public query param)
    if (req.query.public === 'true') {
      query += ' WHERE p.listed_in_research_page = true AND p.is_published = true';
      if (featured === 'true') {
        query += ' AND p.is_featured = true';
      }
    } else {
      if (featured === 'true') {
        query += ' WHERE p.is_featured = true';
      }
    }

    query += ' ORDER BY p.sort_order ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/projects/:idOrSlug
router.get('/:id', async (req, res) => {
  try {
    const isNumeric = /^\d+$/.test(req.params.id);
    let query = 'SELECT p.*, r.title as research_area_name FROM projects p LEFT JOIN research_areas r ON p.research_area_id = r.id WHERE ';
    let params = [req.params.id];
    
    if (isNumeric) {
      query += 'p.id = $1 OR p.slug = $1';
    } else {
      query += 'p.slug = $1';
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    
    const project = result.rows[0];

    // Fetch associated people
    const peopleResult = await pool.query(
      `SELECT pp.role, pp.sort_order, t.id, t.name, t.title, t.image_url, t.category 
       FROM project_people pp 
       JOIN team_members t ON pp.person_id = t.id 
       WHERE pp.project_id = $1 
       ORDER BY pp.sort_order ASC`,
      [project.id]
    );
    project.associated_people = peopleResult.rows;

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/projects
router.post('/', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { 
      title, description, research_area_id, image_url, case_study_link, is_featured, sort_order,
      status, content, start_date, end_date, header_image_url, is_published, listed_in_research_page,
      associated_people 
    } = req.body;
    
    // Generate unique slug
    let slug = generateSlug(title);
    let uniqueSlug = slug;
    let count = 1;
    let exists = true;
    while (exists) {
      const check = await client.query('SELECT id FROM projects WHERE slug = $1', [uniqueSlug]);
      if (check.rows.length > 0) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      } else {
        exists = false;
      }
    }

    const result = await client.query(
      `INSERT INTO projects 
      (title, description, research_area_id, image_url, case_study_link, is_featured, sort_order, slug, status, content, start_date, end_date, header_image_url, is_published, listed_in_research_page) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        title, description, research_area_id || null, image_url, case_study_link, is_featured || false, sort_order || 0,
        uniqueSlug, status || 'Ongoing', content || '', start_date || null, end_date || null, header_image_url || '', 
        is_published !== undefined ? is_published : true, 
        listed_in_research_page !== undefined ? listed_in_research_page : true
      ]
    );
    
    const projectId = result.rows[0].id;

    // Insert associated people
    if (associated_people && Array.isArray(associated_people)) {
      for (let person of associated_people) {
        await client.query(
          'INSERT INTO project_people (project_id, person_id, role, sort_order) VALUES ($1, $2, $3, $4)',
          [projectId, person.person_id || person.id, person.role || '', person.sort_order || 0]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  } finally {
    client.release();
  }
});

// PUT /api/projects/:id
router.put('/:id', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { 
      title, description, research_area_id, image_url, case_study_link, is_featured, sort_order,
      status, content, start_date, end_date, header_image_url, is_published, listed_in_research_page,
      associated_people, slug
    } = req.body;
    
    let targetSlug = slug;
    if (!targetSlug && title) {
      targetSlug = generateSlug(title);
    }
    
    // Check if slug is unique (ignoring self)
    if (targetSlug) {
        let uniqueSlug = targetSlug;
        let count = 1;
        let exists = true;
        while (exists) {
          const check = await client.query('SELECT id FROM projects WHERE slug = $1 AND id != $2', [uniqueSlug, req.params.id]);
          if (check.rows.length > 0) {
            uniqueSlug = `${targetSlug}-${count}`;
            count++;
          } else {
            exists = false;
          }
        }
        targetSlug = uniqueSlug;
    }

    const result = await client.query(
      `UPDATE projects SET 
       title=$1, description=$2, research_area_id=$3, image_url=$4, case_study_link=$5, 
       is_featured=$6, sort_order=$7, updated_at=CURRENT_TIMESTAMP,
       status=$8, content=$9, start_date=$10, end_date=$11, header_image_url=$12, 
       is_published=$13, listed_in_research_page=$14, slug=COALESCE($15, slug)
       WHERE id=$16 RETURNING *`,
      [
        title, description, research_area_id || null, image_url, case_study_link, 
        is_featured || false, sort_order || 0,
        status || 'Ongoing', content || '', start_date || null, end_date || null, header_image_url || '',
        is_published !== undefined ? is_published : true, 
        listed_in_research_page !== undefined ? listed_in_research_page : true,
        targetSlug, req.params.id
      ]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Not found.' });
    }

    // Update associated people
    if (associated_people && Array.isArray(associated_people)) {
      await client.query('DELETE FROM project_people WHERE project_id = $1', [req.params.id]);
      for (let person of associated_people) {
        await client.query(
          'INSERT INTO project_people (project_id, person_id, role, sort_order) VALUES ($1, $2, $3, $4)',
          [req.params.id, person.person_id || person.id, person.role || '', person.sort_order || 0]
        );
      }
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  } finally {
    client.release();
  }
});

// DELETE /api/projects/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // project_people has ON DELETE CASCADE, so we don't need to manually delete
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
