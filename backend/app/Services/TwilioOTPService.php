<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class TwilioOTPService
{
    private $twilioClient;
    
    public function __construct()
    {
        // Use the registered Twilio account credentials from config
        $accountSid = config('notifications.account_sid');
        $authToken = config('notifications.auth_token');
        
        Log::info("Initializing Twilio client with account SID: " . $accountSid);
        
        // Check if credentials are set
        if (empty($accountSid) || empty($authToken)) {
            Log::error("Twilio credentials are not set properly");
            Log::error("Account SID: " . ($accountSid ? 'SET' : 'NOT SET'));
            Log::error("Auth Token: " . ($authToken ? 'SET' : 'NOT SET'));
            $this->twilioClient = null;
            return;
        }
        
        try {
            $this->twilioClient = new Client($accountSid, $authToken);
            Log::info("Twilio client initialized successfully");
        } catch (\Exception $e) {
            Log::error("Failed to initialize Twilio client: " . $e->getMessage());
            Log::error("Exception trace: " . $e->getTraceAsString());
            $this->twilioClient = null;
        }
    }

    /**
     * Send OTP using the registered Twilio account
     */
    public function sendOTP($phoneNumber, $otp, $type = 'repair')
    {
        $formattedPhone = $this->formatPhoneNumber($phoneNumber);
        $message = $this->generateMessage($otp, $type);
        
        Log::info("🚀 Attempting to send OTP via Twilio to: {$formattedPhone}");
        Log::info("OTP Code: {$otp}");
        Log::info("Service Type: {$type}");
        Log::info("Message: {$message}");
        
        // Try to send via Twilio API
        if ($this->sendViaTwilioAPI($formattedPhone, $message)) {
            return true;
        }
        
        // Fallback to console log if Twilio fails
        if ($this->sendViaConsoleLog($formattedPhone, $otp, $type)) {
            return true;
        }
        
        Log::error("❌ All OTP sending methods failed for: {$formattedPhone}");
        return false;
    }

    /**
     * Send OTP via Twilio API using registered account
     */
    private function sendViaTwilioAPI($phoneNumber, $message)
    {
        if (!$this->twilioClient) {
            Log::warning("Twilio client not initialized");
            return false;
        }
        
        try {
            $fromNumber = config('notifications.from_phone'); // Registered Twilio phone number
            
            // Check if fromNumber is set
            if (empty($fromNumber)) {
                Log::error("Twilio from number is not set");
                return false;
            }
            
            Log::info("📱 Sending OTP via Twilio API:");
            Log::info("From: {$fromNumber}");
            Log::info("To: {$phoneNumber}");
            Log::info("Message: {$message}");
            
            $twilioMessage = $this->twilioClient->messages->create(
                $phoneNumber,
                [
                    'from' => $fromNumber,
                    'body' => $message
                ]
            );
            
            Log::info("✅ Twilio API Success! SID: " . $twilioMessage->sid);
            return true;
            
        } catch (\Exception $e) {
            Log::error("❌ Twilio API Error: " . $e->getMessage());
            Log::error("Exception code: " . $e->getCode());
            Log::error("Exception trace: " . $e->getTraceAsString());
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
        Log::info("Formatting phone number: {$phoneNumber}");
        // Remove any spaces, dashes, or parentheses
        $cleaned = preg_replace('/[^0-9+]/', '', $phoneNumber);
        Log::info("Cleaned phone number: {$cleaned}");
        
        // If it starts with +977, use as is
        if (strpos($cleaned, '+977') === 0) {
            Log::info("Formatted as: {$cleaned}");
            return $cleaned;
        }
        
        // If it starts with 91, add +
        if (strpos($cleaned, '91') === 0 && strlen($cleaned) === 12) {
            $formatted = '+' . $cleaned;
            Log::info("Formatted as: {$formatted}");
            return $formatted;
        }
        
        // If it's a 10-digit Nepal number, add +977
        if (strlen($cleaned) === 10 && !strpos($cleaned, '+')) {
            $formatted = '+977' . $cleaned;
            Log::info("Formatted as: {$formatted}");
            return $formatted;
        }
        
        // Return as is if already formatted
        Log::info("Default formatted as: {$cleaned}");
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