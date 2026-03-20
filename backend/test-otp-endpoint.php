<?php
// Test script to verify the OTP endpoint is working

echo "Testing OTP endpoint...\n";

// Test data
$testData = [
    'phone_number' => '+9779731852323',
    'otp' => '1234',
    'type' => 'repair'
];

// Convert to JSON
$jsonData = json_encode($testData);

echo "Test data: " . $jsonData . "\n";

// Make HTTP request to the endpoint
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/send-otp');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($jsonData)
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

if ($httpCode === 200) {
    echo "✅ OTP endpoint is working!\n";
} else {
    echo "❌ OTP endpoint failed with HTTP code: " . $httpCode . "\n";
}