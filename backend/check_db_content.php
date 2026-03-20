<?php
// Load Laravel application
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Check if content table exists
    if (DB::getSchemaBuilder()->hasTable('content')) {
        echo "Content table exists\n";
        
        // Count records
        $count = DB::table('content')->count();
        echo "Total content records: " . $count . "\n";
        
        // Get all records with their sizes
        $records = DB::table('content')->get();
        $totalSize = 0;
        
        echo "\nContent records:\n";
        foreach ($records as $record) {
            $size = strlen($record->key) + strlen($record->value) + strlen($record->type);
            $totalSize += $size;
            echo "- ID: " . $record->id . ", Key: " . $record->key . ", Type: " . $record->type . ", Size: " . $size . " bytes\n";
        }
        
        echo "\nTotal data size: " . $totalSize . " bytes\n";
        echo "Average record size: " . ($totalSize / $count) . " bytes\n";
    } else {
        echo "Content table does not exist\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}