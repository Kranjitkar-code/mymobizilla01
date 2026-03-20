import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  serviceType: 'Buyback',
  details: 'Test device buyback',
  deviceCategory: 'laptop',
  brand: 'Dell',
  model: 'XPS 13',
  condition: 'Good',
  quoteValue: '₨15,000',
  phone: '+1234567890'
};

// Test the server endpoint
async function testServer() {
  try {
    console.log('Testing Google Forms backend server...');
    console.log('Test data:', testData);
    
    const response = await axios.post(`${API_URL}/submit`, testData);
    console.log('✅ Success! Server responded with:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Test health endpoint
async function testHealth() {
  try {
    console.log('Testing health endpoint...');
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check success:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testHealth();
  await testServer();
}

runTests();