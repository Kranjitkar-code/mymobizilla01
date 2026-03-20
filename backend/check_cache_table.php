<?php
// Simple script to check if cache table exists and create it if not

echo "Checking cache table...\n";

// Connect to SQLite database
try {
    $pdo = new PDO('sqlite:database/database.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if cache table exists
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='cache'");
    $table = $stmt->fetch();
    
    if ($table) {
        echo "Cache table exists\n";
        
        // Count records
        $stmt = $pdo->query("SELECT COUNT(*) FROM cache");
        $count = $stmt->fetchColumn();
        echo "Cache table has {$count} records\n";
        
        // Test insert
        $key = 'test_cache_key_' . time();
        $value = serialize('test_value');
        $expiration = time() + 300;
        
        $stmt = $pdo->prepare("INSERT INTO cache (key, value, expiration) VALUES (?, ?, ?)");
        $stmt->execute([$key, $value, $expiration]);
        echo "Test record inserted\n";
        
        // Test retrieval
        $stmt = $pdo->prepare("SELECT value FROM cache WHERE key = ?");
        $stmt->execute([$key]);
        $result = $stmt->fetchColumn();
        if ($result) {
            echo "Cache retrieval working: " . unserialize($result) . "\n";
        }
        
        // Clean up
        $stmt = $pdo->prepare("DELETE FROM cache WHERE key = ?");
        $stmt->execute([$key]);
        echo "Test record cleaned up\n";
    } else {
        echo "Cache table does not exist. Creating it...\n";
        
        // Create cache table
        $pdo->exec("CREATE TABLE cache (
            key TEXT PRIMARY KEY,
            value TEXT,
            expiration INTEGER
        )");
        
        echo "Cache table created successfully\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}