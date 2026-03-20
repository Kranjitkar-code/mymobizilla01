<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Test database connection
    $content = DB::table('content')->get();
    echo "Database connection successful!\n";
    echo "Found " . $content->count() . " content items\n";
    
    foreach ($content as $item) {
        echo "ID: " . $item->id . "\n";
        echo "Key: " . $item->key . "\n";
        echo "Value: " . substr($item->value, 0, 50) . "...\n";
        echo "Type: " . $item->type . "\n";
        echo "Created: " . $item->created_at . "\n";
        echo "Updated: " . $item->updated_at . "\n";
        echo "---\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}