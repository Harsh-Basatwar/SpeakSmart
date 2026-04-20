require('dotenv').config();
const { promisePool } = require('./config/database');

async function testConnection() {
  console.log('🔍 Testing MySQL Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('Test 1: Basic Connection');
    const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
    console.log('✅ Connection successful! Test query result:', rows[0].result);

    // Test 2: Database selection
    console.log('\nTest 2: Database Selection');
    const [dbResult] = await promisePool.query('SELECT DATABASE() as db');
    console.log('✅ Current database:', dbResult[0].db);

    // Test 3: Tables exist
    console.log('\nTest 3: Checking Tables');
    const [tables] = await promisePool.query('SHOW TABLES');
    console.log('✅ Tables found:', tables.length);
    tables.forEach(table => {
      console.log('   -', Object.values(table)[0]);
    });

    // Test 4: Sample data
    console.log('\nTest 4: Sample Data');
    const [users] = await promisePool.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users count:', users[0].count);

    const [flashcards] = await promisePool.query('SELECT COUNT(*) as count FROM flashcards');
    console.log('✅ Flashcards count:', flashcards[0].count);

    const [quizzes] = await promisePool.query('SELECT COUNT(*) as count FROM quizzes');
    console.log('✅ Quizzes count:', quizzes[0].count);

    console.log('\n🎉 All tests passed! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check if MySQL server is running');
    console.error('2. Verify credentials in .env file');
    console.error('3. Ensure database "english_learning_platform" exists');
    console.error('4. Run schema.sql in MySQL Workbench');
    process.exit(1);
  }
}

testConnection();
