<?php
// Test script to verify configuration loading

require_once 'vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

echo "Testing Configuration Loading...\n";
echo "===============================\n";

// Test environment variables
echo "TWILIO_SID: " . ($_ENV['TWILIO_SID'] ?? 'Not set') . "\n";
echo "TWILIO_AUTH_TOKEN: " . ($_ENV['TWILIO_AUTH_TOKEN'] ?? 'Not set') . "\n";
echo "TWILIO_PHONE_NUMBER: " . ($_ENV['TWILIO_PHONE_NUMBER'] ?? 'Not set') . "\n";

echo "\nTesting Config Helper...\n";
echo "========================\n";

// Bootstrap Laravel app to test config helper
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "notifications.account_sid: " . config('notifications.account_sid') . "\n";
echo "notifications.auth_token: " . config('notifications.auth_token') . "\n";
echo "notifications.from_phone: " . config('notifications.from_phone') . "\n";