<?php
// Full test script for OTP functionality within Laravel context

require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

use App\Services\TwilioOTPService;

// Bootstrap the Laravel application
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test the Twilio OTP service
echo "Testing Twilio OTP Service...\n";

// Create an instance of the service
$otpService = new TwilioOTPService();

// Test sending OTP to a phone number
$phoneNumber = '+9779876543210'; // Test phone number
$otp = '1234';
$type = 'repair';

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