<?php
echo "Cache test script\n";
echo "Current directory: " . getcwd() . "\n";
echo "Database file exists: " . (file_exists('database/database.sqlite') ? 'Yes' : 'No') . "\n";