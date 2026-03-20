<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;
use App\Services\TwilioOTPService;

class OTPController extends Controller
{
    /**
     * Send OTP via SMS
     */
    public function sendOTP(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|min:10',
            'otp' => 'required|string|size:4',
            'type' => 'required|string|in:repair,buyback'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Use the TwilioOTPService which has proper fallback mechanisms
            $twilioService = new TwilioOTPService();
            
            // Send OTP using the service
            $result = $twilioService->sendOTP($request->phone_number, $request->otp, $request->type);

            if ($result) {
                Log::info('OTP sent successfully', [
                    'type' => $request->type,
                    'phone' => $request->phone_number
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'OTP sent successfully'
                ]);
            } else {
                Log::error('Failed to send OTP', [
                    'request_data' => $request->all()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send OTP'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Failed to send OTP: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP: ' . $e->getMessage()
            ], 500);
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
}