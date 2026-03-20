<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ReliableOTPService
{
    /**
     * Send OTP using multiple reliable providers with fallback
     */
    public function sendOTP($phoneNumber, $otp, $type = 'repair')
    {
        $formattedPhone = $this->formatPhoneNumber($phoneNumber);
        $message = $this->generateMessage($otp, $type);
        
        Log::info("🚀 Attempting to send OTP to: {$formattedPhone}");
        
        // Try Method 1: Direct Twilio API call (bypasses SDK restrictions)
        if ($this->sendViaTwilioAPI($formattedPhone, $message)) {
            return true;
        }
        
        // Try Method 2: SMS Gateway API
        if ($this->sendViaSMSGateway($formattedPhone, $message)) {
            return true;
        }
        
        // Try Method 3: Backup SMS service
        if ($this->sendViaBackupService($formattedPhone, $message)) {
            return true;
        }
        
        Log::error("❌ All OTP sending methods failed for: {$formattedPhone}");
        return false;
    }

    /**
     * Send OTP via direct Twilio API call
     */
    private function sendViaTwilioAPI($phoneNumber, $message)
    {
        try {
            $accountSid = config('notifications.account_sid');
            $authToken = config('notifications.auth_token');
            $fromNumber = config('notifications.from_phone');
            
            if (!$accountSid || !$authToken || !$fromNumber) {
                Log::warning("Twilio credentials not configured");
                return false;
            }
            
            Log::info("📞 Trying Twilio API for: {$phoneNumber}");
            
            $response = Http::withBasicAuth($accountSid, $authToken)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json", [
                    'From' => $fromNumber,
                    'To' => $phoneNumber,
                    'Body' => $message
                ]);
            
            if ($response->successful()) {
                $data = $response->json();
                Log::info("✅ Twilio API success! SID: " . ($data['sid'] ?? 'N/A'));
                return true;
            } else {
                $error = $response->json();
                Log::warning("⚠️ Twilio API failed: " . ($error['message'] ?? 'Unknown error'));
                return false;
            }
            
        } catch (\Exception $e) {
            Log::warning("⚠️ Twilio API exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send OTP via SMS Gateway service
     */
    private function sendViaSMSGateway($phoneNumber, $message)
    {
        try {
            Log::info("📱 Trying SMS Gateway for: {$phoneNumber}");
            
            // Using TextLocal API as backup
            $apiKey = 'your_textlocal_api_key'; // You can get this from textlocal.in
            
            if ($apiKey === 'your_textlocal_api_key') {
                Log::info("SMS Gateway API key not configured, skipping...");
                return false;
            }
            
            $response = Http::asForm()->post('https://api.textlocal.in/send/', [
                'apikey' => $apiKey,
                'numbers' => $phoneNumber,
                'message' => $message,
                'sender' => 'SNAPTE'
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                if ($data['status'] === 'success') {
                    Log::info("✅ SMS Gateway success!");
                    return true;
                }
            }
            
            Log::warning("⚠️ SMS Gateway failed");
            return false;
            
        } catch (\Exception $e) {
            Log::warning("⚠️ SMS Gateway exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send OTP via backup service
     */
    private function sendViaBackupService($phoneNumber, $message)
    {
        try {
            Log::info("🔄 Trying backup service for: {$phoneNumber}");
            
            // Using 2Factor API as backup
            $apiKey = 'your_2factor_api_key'; // You can get this from 2factor.in
            
            if ($apiKey === 'your_2factor_api_key') {
                Log::info("Backup service API key not configured");
                return false;
            }
            
            $response = Http::get('https://2factor.in/API/V1/' . $apiKey . '/SMS/' . $phoneNumber . '/' . urlencode($message));
            
            if ($response->successful()) {
                $data = $response->json();
                if ($data['Status'] === 'Success') {
                    Log::info("✅ Backup service success!");
                    return true;
                }
            }
            
            Log::warning("⚠️ Backup service failed");
            return false;
            
        } catch (\Exception $e) {
            Log::warning("⚠️ Backup service exception: " . $e->getMessage());
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