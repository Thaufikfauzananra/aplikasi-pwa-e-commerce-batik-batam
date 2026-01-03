import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('📡 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected!');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    // List tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\n📋 Tables in database:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    console.log('\n✅ Database migration successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

