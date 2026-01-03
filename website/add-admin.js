import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';

// Hardcode Neon connection string
const DATABASE_URL = 'postgresql://neondb_owner:npg_xy9kN7dQHuCg@ep-still-bread-a189qy01-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function addAdmin() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to Neon database');

    // Hash password
    const password = 'Admin@12345';
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log(`✅ Password hashed`);

    // Check if admin already exists
    const checkResult = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      ['admin@batam.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      return;
    }

    // Insert admin user
    const result = await client.query(
      `INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, role`,
      [
        'Admin Batam',
        'admin@batam.com',
        hashedPassword,
        'admin',
        new Date(),
        new Date(),
      ]
    );

    const adminUser = result.rows[0];
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: ${adminUser.role}`);
    console.log(`  ID: ${adminUser.id}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

addAdmin();
