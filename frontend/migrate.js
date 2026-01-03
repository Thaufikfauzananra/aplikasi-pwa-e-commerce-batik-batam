import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = 'postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function runMigration() {
  let client;
  try {
    client = await pool.connect();
    
    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'prisma/migrations/001_init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 Running migration...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runMigration();
