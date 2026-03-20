// Test script for Twilio OTP service
// Run this in the browser console to test the Twilio OTP service

console.log('Testing Twilio OTP Service...');

// Make sure the service is available
if (typeof twilioOTPService !== 'undefined') {
  console.log('✅ twilioOTPService is available');
  
  // Test the service with a phone number
  // Note: For testing purposes, you can use your own phone number
  const testPhoneNumber = '+9779876543210'; // Replace with your phone number for testing
  
  twilioOTPService.sendOTP(testPhoneNumber, '1234', 'repair')
    .then(result => {
      console.log('✅ Twilio OTP Service Result:', result);
    })
    .catch(error => {
      console.error('❌ Twilio OTP Service Error:', error);
    });
} else {
  console.log('❌ twilioOTPService is not available');
  console.log('Make sure you have imported the service correctly');
}