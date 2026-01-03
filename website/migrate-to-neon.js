#!/usr/bin/env node

/**
 * Script untuk migrasi database ke Neon PostgreSQL (Frontend)
 * 
 * Usage:
 *   node migrate-to-neon.js
 * 
 * Prerequisites:
 *   1. DATABASE_URL sudah di-set di .env.local
 *   2. Prisma sudah terinstall (npm install)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('🚀 Starting database migration to Neon (Frontend)...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected!\n');

    // Check existing tables
    console.log('📊 Checking existing tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('Existing tables:', tables.map(t => t.table_name).join(', ') || 'None\n');

    // Run migrations
    console.log('🔄 Running Prisma migrations...');
    const { execSync } = require('child_process');
    
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('✅ Migrations completed!\n');
    } catch (error) {
      console.log('⚠️  migrate deploy failed, trying migrate dev...\n');
      execSync('npx prisma migrate dev --name init', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('✅ Migrations completed!\n');
    }

    // Verify tables
    console.log('✅ Verifying tables...');
    const userCount = await prisma.user.count();
    const tokenCount = await prisma.passwordResetToken.count();
    
    console.log(`\n📈 Database Statistics:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Password Reset Tokens: ${tokenCount}`);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Note: Frontend and backend can share the same database.');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check DATABASE_URL in .env.local file');
      console.error('   2. Ensure you\'re using pooler endpoint (not direct)');
      console.error('   3. Verify database is active in Neon console');
      console.error('   4. Check internet connection');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrate();

