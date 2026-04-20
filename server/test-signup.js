const { promisePool } = require('./config/database');

async function testSignup() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const [rows] = await promisePool.query('SELECT 1 as test');
    console.log('✅ Database connected');
    
    // Check if users table exists
    const [tables] = await promisePool.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.error('❌ users table does not exist!');
      console.log('Run: mysql -u root -p < database/schema.sql');
      process.exit(1);
    }
    console.log('✅ users table exists');
    
    // Check users table structure
    const [columns] = await promisePool.query('DESCRIBE users');
    console.log('✅ users table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Check if user_progress table exists
    const [progressTables] = await promisePool.query("SHOW TABLES LIKE 'user_progress'");
    if (progressTables.length === 0) {
      console.error('❌ user_progress table does not exist!');
      process.exit(1);
    }
    console.log('✅ user_progress table exists');
    
    console.log('\n✅ All database checks passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testSignup();
