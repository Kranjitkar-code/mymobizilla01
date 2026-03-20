<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check if content table exists
if (Schema::hasTable('content')) {
    echo "Content table exists\n";
    
    // Count records
    $count = DB::table('content')->count();
    echo "Total content records: " . $count . "\n";
    
    // Show first 5 records
    $records = DB::table('content')->limit(5)->get();
    echo "First 5 records:\n";
    foreach ($records as $record) {
        echo "- ID: " . $record->id . ", Key: " . $record->key . ", Type: " . $record->type . "\n";
    }
} else {
    echo "Content table does not exist\n";
}