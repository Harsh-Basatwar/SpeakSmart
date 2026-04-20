const axios = require('axios');

async function testSignup() {
  try {
    console.log('Testing signup endpoint...');
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/signup', testUser);
    console.log('✅ Signup successful:', response.data);
    
  } catch (error) {
    console.error('❌ Signup failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data || error.message);
  }
}

async function testHealth() {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server health check:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function runTests() {
  await testHealth();
  await testSignup();
}

runTests();