<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DataCollectionController extends Controller
{
    /**
     * Store booking data to CSV format (Excel compatible)
     */
    public function storeBookingData(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'device_category' => 'required|string',
            'brand' => 'required|string',
            'model' => 'required|string',
            'customer_name' => 'required|string|min:2',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'required|string|min:10',
            'service_type' => 'required|string|in:repair,buyback',
            'submission_time' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get the data from request
            $data = $request->all();
            
            // Define the CSV file path
            $csvFile = storage_path('app/bookings_data.csv');
            
            // Check if file exists, if not create with headers
            $headers = [
                'ID',
                'Service Type',
                'Device Category',
                'Brand',
                'Model',
                'Issue/Condition',
                'Customer Name',
                'Customer Email',
                'Customer Phone',
                'Quote Value',
                'Description',
                'Submission Time'
            ];
            
            // Check if this is a repair or buyback request
            $issueOrCondition = isset($data['issue']) ? $data['issue'] : (isset($data['condition']) ? $data['condition'] : '');
            $quoteValue = isset($data['quote_value']) ? $data['quote_value'] : '';
            $description = isset($data['description']) ? $data['description'] : '';
            
            // Prepare data row
            $rowData = [
                Str::random(8), // ID
                ucfirst($data['service_type']), // Capitalize first letter
                ucfirst($data['device_category']),
                $data['brand'],
                $data['model'],
                $issueOrCondition,
                $data['customer_name'],
                $data['customer_email'] ?? '',
                $data['customer_phone'],
                $quoteValue,
                $description,
                $data['submission_time']
            ];
            
            // Create directory if it doesn't exist
            if (!File::exists(storage_path('app'))) {
                File::makeDirectory(storage_path('app'), 0755, true);
            }
            
            // Write to CSV file
            $fileExists = File::exists($csvFile);
            $file = fopen($csvFile, 'a');
            
            // Add headers if file is new
            if (!$fileExists) {
                fputcsv($file, $headers);
            }
            
            // Add data row
            fputcsv($file, $rowData);
            fclose($file);
            
            // Log the data collection
            Log::info('Booking data collected', [
                'service_type' => $data['service_type'],
                'customer' => $data['customer_name'],
                'device' => $data['brand'] . ' ' . $data['model']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data collected successfully!'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to collect booking data: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to collect data. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all booking data
     */
    public function getBookingData()
    {
        try {
            // Define the CSV file path
            $csvFile = storage_path('app/bookings_data.csv');
            
            // Check if file exists
            if (!File::exists($csvFile)) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }
            
            // Read CSV file
            $file = fopen($csvFile, 'r');
            $headers = fgetcsv($file);
            
            $data = [];
            while (($row = fgetcsv($file)) !== false) {
                $data[] = array_combine($headers, $row);
            }
            
            fclose($file);
            
            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve booking data: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve data. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export booking data as CSV
     */
    public function exportBookingData()
    {
        try {
            // Define the CSV file path
            $csvFile = storage_path('app/bookings_data.csv');
            
            // Check if file exists
            if (!File::exists($csvFile)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data available for export'
                ], 404);
            }
            
            // Return the CSV file
            return response()->download($csvFile, 'bookings_data.csv');

        } catch (\Exception $e) {
            Log::error('Failed to export booking data: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to export data. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get booking statistics
     */
    public function getBookingStats()
    {
        try {
            // Define the CSV file path
            $csvFile = storage_path('app/bookings_data.csv');
            
            // Check if file exists
            if (!File::exists($csvFile)) {
                return response()->json([
                    'success' => true,
                    'stats' => [
                        'total_bookings' => 0,
                        'repair_bookings' => 0,
                        'buyback_bookings' => 0
                    ]
                ]);
            }
            
            // Read CSV file
            $file = fopen($csvFile, 'r');
            $headers = fgetcsv($file);
            
            $total = 0;
            $repairs = 0;
            $buybacks = 0;
            
            // Skip headers and count rows
            while (($row = fgetcsv($file)) !== false) {
                $total++;
                $data = array_combine($headers, $row);
                if (strtolower($data['Service Type']) === 'repair') {
                    $repairs++;
                } elseif (strtolower($data['Service Type']) === 'buyback') {
                    $buybacks++;
                }
            }
            
            fclose($file);
            
            return response()->json([
                'success' => true,
                'stats' => [
                    'total_bookings' => $total,
                    'repair_bookings' => $repairs,
                    'buyback_bookings' => $buybacks
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve booking stats: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stats. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}