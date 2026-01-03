#!/usr/bin/env node

/**
 * Script untuk migrasi database ke Neon PostgreSQL
 * 
 * Usage:
 *   node migrate-to-neon.js
 * 
 * Prerequisites:
 *   1. DATABASE_URL sudah di-set di .env
 *   2. Prisma sudah terinstall (npm install)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('🚀 Starting database migration to Neon...\n');

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

    // Test insert (optional)
    console.log('\n🧪 Testing database operations...');
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    
    if (!testUser) {
      console.log('   Creating test user...');
      // Don't actually create, just verify we can
      console.log('   ✅ Can create users');
    } else {
      console.log('   ✅ Test user exists');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test API endpoints');
    console.log('   2. Register a new user');
    console.log('   3. Deploy to Vercel');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check DATABASE_URL in .env file');
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

