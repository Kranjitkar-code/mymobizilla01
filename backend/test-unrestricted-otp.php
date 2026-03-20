<?php

require_once 'vendor/autoload.php';

use App\Services\UnrestrictedOTPService;

// Create an instance of the service
$otpService = new UnrestrictedOTPService();

// Test sending OTP to a phone number
$phoneNumber = '+9779876543210';
$otp = '1234';
$type = 'repair';

echo "Testing Unrestricted OTP Service\n";
echo "Phone Number: $phoneNumber\n";
echo "OTP: $otp\n";
echo "Type: $type\n";
echo "===============================\n";

$result = $otpService->sendOTP($phoneNumber, $otp, $type);

if ($result) {
    echo "✅ OTP sent successfully!\n";
} else {
    echo "❌ Failed to send OTP\n";
}