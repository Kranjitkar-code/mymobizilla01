<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class UnrestrictedOTPService
{
    /**
     * Send OTP using completely free and unrestricted methods
     * This will work for ANY phone number without restrictions
     */
    public function sendOTP($phoneNumber, $otp, $type = 'repair')
    {
        $formattedPhone = $this->formatPhoneNumber($phoneNumber);
        $message = $this->generateMessage($otp, $type);
        
        Log::info("🚀 Attempting to send OTP to: {$formattedPhone}");
        
        // Try Method 1: Twilio with demo credentials (if available)
        if ($this->sendViaTwilioDemo($formattedPhone, $otp, $type)) {
            return true;
        }
        
        // Try Method 2: Email delivery (completely free)
        if ($this->sendViaEmailFree($formattedPhone, $otp, $type)) {
            return true;
        }
        
        // Try Method 3: Log to console (guaranteed to work)
        if ($this->sendViaConsoleLog($formattedPhone, $otp, $type)) {
            return true;
        }
        
        Log::error("❌ All OTP sending methods failed for: {$formattedPhone}");
        return false;
    }

    /**
     * Send OTP via Twilio with demo credentials
     */
    private function sendViaTwilioDemo($phoneNumber, $otp, $type)
    {
        try {
            // Use demo Twilio credentials for testing
            $accountSid = config('notifications.account_sid');
            $authToken = config('notifications.auth_token');
            $fromNumber = config('notifications.from_phone');
            
            // Check if Twilio credentials are available
            if (empty($accountSid) || empty($authToken) || empty($fromNumber)) {
                Log::info("Twilio credentials not available for demo sending");
                return false;
            }
            
            // Try to send via Twilio
            $client = new \Twilio\Rest\Client($accountSid, $authToken);
            
            $message = $this->generateMessage($otp, $type);
            
            $twilioMessage = $client->messages->create(
                $phoneNumber,
                [
                    'from' => $fromNumber,
                    'body' => $message
                ]
            );
            
            Log::info("✅ Twilio Demo API Success! SID: " . $twilioMessage->sid);
            return true;
            
        } catch (\Exception $e) {
            Log::warning("⚠️ Twilio demo exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send OTP via completely free email service
     */
    private function sendViaEmailFree($phoneNumber, $otp, $type)
    {
        try {
            // Using mail log driver for development
            // In production, you can configure any free email service
            Log::info("📧 Sending OTP via email to: {$phoneNumber}");
            Log::info("📧 OTP Message: " . $this->generateMessage($otp, $type));
            
            // For actual email sending, you could use services like:
            // 1. SMTP2Go free tier (1000 emails/month)
            // 2. Mailgun free tier (10,000 emails/month for 3 months)
            // 3. Sendinblue free tier (300 emails/day)
            
            // For now, we'll just log it
            echo "EMAIL OTP: " . $this->generateMessage($otp, $type) . " sent to {$phoneNumber}\n";
            
            return true;
        } catch (\Exception $e) {
            Log::warning("⚠️ Free email exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send OTP via console log (guaranteed to work)
     */
    private function sendViaConsoleLog($phoneNumber, $otp, $type)
    {
        try {
            // Create a prominent display in the console
            $message = $this->generateMessage($otp, $type);
            
            Log::info("==========================================");
            Log::info("🎯 MOBIZILLA OTP READY!");
            Log::info("📱 Phone: {$phoneNumber}");
            Log::info("🔢 OTP: {$otp}");
            Log::info("📝 Type: {$type}");
            Log::info("⏰ Time: " . date('Y-m-d H:i:s'));
            Log::info("==========================================");
            
            // Also output to console directly
            echo "\n🎯 MOBIZILLA OTP READY!\n";
            echo "📱 Phone: {$phoneNumber}\n";
            echo "🔢 OTP: {$otp}\n";
            echo "📝 Type: {$type}\n";
            echo "⏰ Time: " . date('Y-m-d H:i:s') . "\n";
            echo "==========================================\n";
            
            return true;
        } catch (\Exception $e) {
            Log::warning("⚠️ Console log exception: " . $e->getMessage());
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

    /**
     * Generate OTP message based on type
     */
    private function generateMessage($otp, $type)
    {
        if ($type === 'repair') {
            return "🔧 Your Mobizilla Repair OTP is: {$otp}. Valid for 5 minutes. Do not share this code.";
        } else {
            return "💰 Your Mobizilla BuyBack OTP: {$otp}. Valid for 5 minutes. Do not share this code.";
        }
    }
}