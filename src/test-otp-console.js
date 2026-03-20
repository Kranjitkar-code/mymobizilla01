// Test script to run in browser console
// Copy and paste this into your browser's developer console to test the OTP service

console.log('Testing Free Unrestricted OTP Service...');

// Make sure the service is available
if (typeof freeUnrestrictedOTPService !== 'undefined') {
  console.log('✅ freeUnrestrictedOTPService is available');
  
  // Test the service
  freeUnrestrictedOTPService.sendOTP('+9779876543210', '1234', 'repair')
    .then(result => {
      console.log('✅ OTP Service Result:', result);
    })
    .catch(error => {
      console.error('❌ OTP Service Error:', error);
    });
} else {
  console.log('❌ freeUnrestrictedOTPService is not available');
  console.log('Make sure you have imported the service correctly');
}