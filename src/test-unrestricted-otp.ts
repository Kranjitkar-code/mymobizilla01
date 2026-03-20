import { freeUnrestrictedOTPService } from "./services/freeUnrestrictedOTPService";

async function testUnrestrictedOTP() {
  console.log("Testing Free Unrestricted OTP Service");
  
  const phoneNumber = "+9779876543210";
  const otp = "1234";
  const type: 'repair' | 'buyback' = 'repair';
  
  console.log("Phone Number:", phoneNumber);
  console.log("OTP:", otp);
  console.log("Type:", type);
  console.log("===============================");
  
  try {
    const result = await freeUnrestrictedOTPService.sendOTP(phoneNumber, otp, type);
    console.log("Result:", result);
    
    if (result.success) {
      console.log("✅ OTP sent successfully!");
    } else {
      console.log("❌ Failed to send OTP");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
testUnrestrictedOTP();