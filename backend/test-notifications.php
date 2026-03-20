<?php

// Test script for Twilio SMS and SendGrid Email notifications
// Place this file in the backend directory and run: php test-notifications.php

require_once 'vendor/autoload.php';

use Twilio\\Rest\\Client;
use SendGrid\\Mail\\Mail;

// Configuration
$twilioSid = 'your_twilio_account_sid';
$twilioAuthToken = 'your_twilio_auth_token';
$twilioPhoneNumber = 'your_twilio_phone_number';

$sendGridApiKey = 'your_sendgrid_api_key';
$fromEmail = 'rayyanbusinessofficial@gmail.com';
$fromName = 'Mobizilla';

// Demo contact info
$demoPhone = '+9779731852323';
$demoEmail = 'rayyanbusinessofficial@gmail.com';

echo \"🚀 Mobizilla Notification Test\n\";
echo \"===================================\n\n\";

// Test data
$testBooking = [
    'public_code' => 'TEST' . rand(1000, 9999),
    'name' => 'Test Customer',
    'device_brand' => 'Apple',
    'device_model' => 'iPhone 13',
    'issue' => 'Screen replacement'
];

$trackingUrl = \"http://localhost:5174/track/{$testBooking['public_code']}\";

echo \"📋 Test Booking Details:\n\";
echo \"- Booking Code: {$testBooking['public_code']}\n\";
echo \"- Customer: {$testBooking['name']}\n\";
echo \"- Device: {$testBooking['device_brand']} {$testBooking['device_model']}\n\";
echo \"- Issue: {$testBooking['issue']}\n\";
echo \"- Tracking URL: {$trackingUrl}\n\n\";

// Test SMS
echo \"📱 Testing SMS Notification...\n\";
try {
    $twilioClient = new Client($twilioSid, $twilioAuthToken);
    
    $message = \"✅ Your Mobizilla repair order #{$testBooking['public_code']} has been placed successfully! Track your repair status here: {$trackingUrl}\";
    
    $result = $twilioClient->messages->create(
        $demoPhone,
        [
            'from' => $twilioPhoneNumber,
            'body' => $message
        ]
    );
    
    echo \"✅ SMS sent successfully!\n\";
    echo \"   - To: {$demoPhone}\n\";
    echo \"   - From: {$twilioPhoneNumber}\n\";
    echo \"   - Message SID: {$result->sid}\n\n\";
    
} catch (Exception $e) {
    echo \"❌ SMS failed: \" . $e->getMessage() . \"\n\n\";
}

// Test Email
echo \"📧 Testing Email Notification...\n\";
try {
    $mail = new Mail();
    
    // Set sender
    $mail->setFrom($fromEmail, $fromName);
    
    // Set recipient
    $mail->addTo($demoEmail, $testBooking['name']);
    
    // Set subject
    $mail->setSubject(\"Repair Order Confirmation - #{$testBooking['public_code']}\");
    
    // Create email content
    $htmlContent = \"
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <title>Repair Order Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>🔧 Mobizilla</h1>
            <p>Your trusted device repair partner</p>
        </div>
        
        <div class='content'>
            <h2>Hi {$testBooking['name']},</h2>
            <p>Thank you for choosing Mobizilla! Your repair order has been successfully placed.</p>
            
            <div class='booking-info'>
                <h3>📋 Order Details</h3>
                <p><strong>Booking Code:</strong> #{$testBooking['public_code']}</p>
                <p><strong>Device:</strong> {$testBooking['device_brand']} {$testBooking['device_model']}</p>
                <p><strong>Issue:</strong> {$testBooking['issue']}</p>
                <p><strong>Status:</strong> Order Received - Awaiting Pickup</p>
            </div>
            
            <h3>🚀 What happens next?</h3>
            <ul>
                <li>Our team will contact you within 2 hours to confirm pickup details</li>
                <li>We'll schedule a convenient pickup time</li>
                <li>Your device will be diagnosed and repaired by certified technicians</li>
                <li>We'll deliver it back to you, fully tested and ready to use</li>
            </ul>
            
            <div style='text-align: center;'>
                <a href='{$trackingUrl}' class='button'>Track Your Repair 📱</a>
            </div>
            
            <p>Need help? Contact us at support@mobizilla.com</p>
            <p>&copy; 2024 Mobizilla. All rights reserved.</p>
        </div>
    </body>
    </html>\";
    
    $textContent = strip_tags($htmlContent);
    
    $mail->addContent(\"text/plain\", $textContent);
    $mail->addContent(\"text/html\", $htmlContent);
    
    // Send email using SendGrid
    $sendgrid = new \\SendGrid($sendGridApiKey);
    $response = $sendgrid->send($mail);
    
    echo \"✅ Email sent successfully!\n\";
    echo \"   - To: {$demoEmail}\n\";
    echo \"   - From: {$fromEmail}\n\";
    echo \"   - Subject: Repair Order Confirmation - #{$testBooking['public_code']}\n\";
    echo \"   - Response Code: \" . $response->statusCode() . \"\n\n\";
    
} catch (Exception $e) {
    echo \"❌ Email failed: \" . $e->getMessage() . \"\n\n\";
}

echo \"🎉 Notification test completed!\n\";
echo \"\n📱 Check your phone (+977 9731852323) for SMS\n\";
echo \"📧 Check your email (rayyanbusinessofficial@gmail.com) for confirmation\n\";
echo \"\n🔗 Frontend is running at: http://127.0.0.1:5174/\n\";
echo \"🔗 Test repair booking at: http://127.0.0.1:5174/#repair\n\";