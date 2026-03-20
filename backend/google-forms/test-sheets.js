import { appendRow } from './sheets.js';

// Test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  serviceType: 'Repair',
  details: 'Test device repair',
  deviceCategory: 'smartphone',
  brand: 'Apple',
  model: 'iPhone 15',
  issue: 'Screen broken',
  phone: '+1234567890'
};

// Test the appendRow function
async function testAppendRow() {
  try {
    console.log('Testing Google Sheets integration...');
    console.log('Test data:', testData);
    
    const result = await appendRow(testData);
    console.log('✅ Success! Data appended to Google Sheets');
    console.log('Response:', result.data);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testAppendRow();