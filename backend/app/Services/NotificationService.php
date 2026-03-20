<?php

namespace App\Services;

use Twilio\Rest\Client;
use SendGrid\Mail\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $twilioClient;
    protected $sendGridApiKey;

    public function __construct()
    {
        // Initialize Twilio client
        $this->twilioClient = new Client(
            config('notifications.account_sid'),
            config('notifications.auth_token')
        );

        // Initialize SendGrid
        $this->sendGridApiKey = config('notifications.sendgrid_api_key');
    }

    /**
     * Send SMS notification for repair booking
     */
    public function sendRepairBookingSMS($phoneNumber, $bookingCode, $trackingUrl)
    {
        try {
            $message = "✅ Your Mobizilla repair order #{$bookingCode} has been placed successfully! Track your repair status here: {$trackingUrl}";
            
            $this->twilioClient->messages->create(
                $phoneNumber,
                [
                    'from' => config('notifications.from_phone'),
                    'body' => $message
                ]
            );

            Log::info("SMS sent successfully to {$phoneNumber} for booking {$bookingCode}");
            return true;

        } catch (\Exception $e) {
            Log::error("Failed to send SMS to {$phoneNumber}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send email notification for repair booking
     */
    public function sendRepairBookingEmail($email, $customerName, $bookingCode, $deviceInfo, $trackingUrl)
    {
        try {
            $mail = new Mail();
            
            // Set sender
            $mail->setFrom(
                config('notifications.sendgrid_from_email'),
                config('notifications.sendgrid_from_name')
            );
            
            // Set recipient
            $mail->addTo($email, $customerName);
            
            // Set subject
            $mail->setSubject("Repair Order Confirmation - #{$bookingCode}");
            
            // Create email content
            $htmlContent = $this->getEmailTemplate($customerName, $bookingCode, $deviceInfo, $trackingUrl);
            $textContent = strip_tags($htmlContent);
            
            $mail->addContent("text/plain", $textContent);
            $mail->addContent("text/html", $htmlContent);
            
            // Send email using SendGrid
            $sendgrid = new \SendGrid($this->sendGridApiKey);
            $response = $sendgrid->send($mail);
            
            Log::info("Email sent successfully to {$email} for booking {$bookingCode}");
            return true;

        } catch (\Exception $e) {
            Log::error("Failed to send email to {$email}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get HTML email template
     */
    private function getEmailTemplate($customerName, $bookingCode, $deviceInfo, $trackingUrl)
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <title>Repair Order Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .booking-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
                .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🔧 Mobizilla</h1>
                    <p>Your trusted device repair partner</p>
                </div>
                
                <div class='content'>
                    <h2>Hi {$customerName},</h2>
                    <p>Thank you for choosing Mobizilla! Your repair order has been successfully placed.</p>
                    
                    <div class='booking-info'>
                        <h3>📋 Order Details</h3>
                        <p><strong>Booking Code:</strong> #{$bookingCode}</p>
                        <p><strong>Device:</strong> {$deviceInfo}</p>
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
                    
                    <div class='footer'>
                        <p>Need help? Contact us at support@mobizilla.com or +977-XXXXXXXXXX</p>
                        <p>&copy; 2024 Mobizilla. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    }

    /**
     * Send both SMS and Email notifications
     */
    public function sendRepairBookingNotifications($bookingData)
    {
        $trackingUrl = config('app.url') . "/track/" . $bookingData['public_code'];
        $deviceInfo = "{$bookingData['device_brand']} {$bookingData['device_model']}";
        
        $results = [
            'sms_sent' => false,
            'email_sent' => false
        ];

        // Send SMS if phone number is provided
        if (!empty($bookingData['phone'])) {
            $results['sms_sent'] = $this->sendRepairBookingSMS(
                $bookingData['phone'],
                $bookingData['public_code'],
                $trackingUrl
            );
        }

        // Send email if email is provided
        if (!empty($bookingData['email'])) {
            $results['email_sent'] = $this->sendRepairBookingEmail(
                $bookingData['email'],
                $bookingData['name'],
                $bookingData['public_code'],
                $deviceInfo,
                $trackingUrl
            );
        }

        return $results;
    }

    /**
     * Send OTP SMS to actual user phone number
     */
    public function sendOTP($phoneNumber, $message)
    {
        try {
            // Format phone number for international SMS
            $formattedPhone = $this->formatPhoneNumber($phoneNumber);
            
            Log::info("Sending OTP to actual phone: {$formattedPhone}");
            
            $this->twilioClient->messages->create(
                $formattedPhone, // Send to user's actual phone number
                [
                    'from' => config('notifications.from_phone'),
                    'body' => $message
                ]
            );

            Log::info("OTP sent successfully to {$formattedPhone}");
            return true;

        } catch (\Exception $e) {
            Log::error("Failed to send OTP to {$phoneNumber}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Format phone number for international SMS
     */
    private function formatPhoneNumber($phoneNumber)
    {
        // Remove any spaces, dashes, or parentheses
        $cleaned = preg_replace('/[^0-9+]/', '', $phoneNumber);
        
        // If it starts with +977, use as is
        if (strpos($cleaned, '+977') === 0) {
            return $cleaned;
        }
        
        // If it starts with 91, add +
        if (strpos($cleaned, '91') === 0 && strlen($cleaned) === 12) {
            return '+' . $cleaned;
        }
        
        // If it's a 10-digit Nepal number, add +977
        if (strlen($cleaned) === 10 && !strpos($cleaned, '+')) {
            return '+977' . $cleaned;
        }
        
        // Return as is if already formatted
        return $cleaned;
    }
}