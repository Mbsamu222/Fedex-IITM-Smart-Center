const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'fedex_smart_center',
});

async function runSeed() {
  try {
    console.log('📦 Running database schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Schema created successfully.');

    console.log('🔐 Hashing admin password...');
    const passwordHash = await bcrypt.hash('admin123', 10);

    console.log('🌱 Running seed data...');
    let seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    // Replace the placeholder hash with the actual bcrypt hash
    seed = seed.replace(
      '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9I0W4Y5GhBPKRUqXXzGBM3sHGy',
      passwordHash
    );
    await pool.query(seed);
    console.log('✅ Seed data inserted successfully.');

    console.log('\n🎉 Database setup complete!');
    console.log('Admin credentials:');
    console.log('  Email: admin@smartcenter.com');
    console.log('  Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

runSeed();
