const pool = require('../config/db');

async function updateHero() {
  const slides = [
    {
      id: 1,
      title: 'Engineering the future of supply chains.',
      subtitle: 'A joint initiative of IIT Madras & FedEx',
      description: 'The SMART Center advances Supply Chain Modelling, Algorithms, Research and Technology — uniting world-class academic research with global logistics expertise to solve problems at planetary scale.',
      cta_primary_text: 'Explore Research',
      cta_primary_link: '#research',
      cta_secondary_text: 'View Projects',
      cta_secondary_link: '#projects',
      image_url: '/uploads/hero_supply_chain.png',
      title_highlight: 'supply chains.',
      floating_tag: 'Live research',
      floating_text: 'National Logistics Digital Twin — modelling freight flows across India.',
      is_active: true
    },
    {
      id: 2,
      title: 'Optimizing multi-modal freight networks.',
      subtitle: 'Logistics Optimization & Operations',
      description: 'Pioneering mathematical programming and optimization algorithms to streamline freight transport across road, rail, and sea lanes.',
      cta_primary_text: 'Our Research',
      cta_primary_link: '#research',
      cta_secondary_text: 'View Case Studies',
      cta_secondary_link: '/publications',
      image_url: '/uploads/hero_freight_network.png',
      title_highlight: 'freight networks.',
      floating_tag: 'Network Design',
      floating_text: 'Multi-modal routing algorithms for large-scale operations.',
      is_active: true
    },
    {
      id: 3,
      title: 'Predictive intelligence for global logistics.',
      subtitle: 'AI Technology & Neural Networks',
      description: 'Deploying time-series transformers and foundation models to achieve SKU-level demand forecasting and real-time operational adaptability.',
      cta_primary_text: 'AI Research',
      cta_primary_link: '#research',
      cta_secondary_text: 'See Publications',
      cta_secondary_link: '/publications',
      image_url: '/uploads/hero_predictive_intelligence.png',
      title_highlight: 'global logistics.',
      floating_tag: 'AI Models',
      floating_text: 'SKU-level forecasting models powered by deep learning.',
      is_active: true
    },
    {
      id: 4,
      title: 'Autonomous aerial last-mile logistics.',
      subtitle: 'Autonomous Last-Mile Delivery',
      description: 'Developing path-planning algorithms and drone platform optimization for fast, last-mile package distribution in urban and remote areas.',
      cta_primary_text: 'Drone Research',
      cta_primary_link: '#research',
      cta_secondary_text: 'Watch Demo',
      cta_secondary_link: '/gallery',
      image_url: '/uploads/hero_autonomous_delivery.png',
      title_highlight: 'last-mile logistics.',
      floating_tag: 'Drone Tech',
      floating_text: 'Path-planning algorithms for last-mile autonomous deliveries.',
      is_active: true
    }
  ];

  try {
    for (const s of slides) {
      const check = await pool.query('SELECT id FROM hero_sections WHERE id = $1', [s.id]);
      if (check.rows.length > 0) {
        await pool.query(
          `UPDATE hero_sections 
           SET title=$1, subtitle=$2, description=$3, cta_primary_text=$4, cta_primary_link=$5, 
               cta_secondary_text=$6, cta_secondary_link=$7, image_url=$8, title_highlight=$9, 
               floating_tag=$10, floating_text=$11, is_active=$12, updated_at=CURRENT_TIMESTAMP 
           WHERE id=$13`,
          [
            s.title, s.subtitle, s.description, s.cta_primary_text, s.cta_primary_link,
            s.cta_secondary_text, s.cta_secondary_link, s.image_url, s.title_highlight,
            s.floating_tag, s.floating_text, s.is_active, s.id
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO hero_sections (
            id, title, subtitle, description, cta_primary_text, cta_primary_link, 
            cta_secondary_text, cta_secondary_link, image_url, title_highlight, 
            floating_tag, floating_text, is_active
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [
            s.id, s.title, s.subtitle, s.description, s.cta_primary_text, s.cta_primary_link,
            s.cta_secondary_text, s.cta_secondary_link, s.image_url, s.title_highlight,
            s.floating_tag, s.floating_text, s.is_active
          ]
        );
      }
    }
    const result = await pool.query('SELECT id, title, image_url, is_active FROM hero_sections ORDER BY id ASC');
    console.log('✅ Successfully updated hero sections database records:');
    console.log(result.rows);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update hero sections:', err);
    process.exit(1);
  }
}

updateHero();
