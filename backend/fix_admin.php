<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Initialize the application
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Ensure users table has is_admin column
if (!Schema::hasColumn('users', 'is_admin')) {
    echo "Adding is_admin column to users table...\n";
    Schema::table('users', function (Blueprint $table) {
        $table->boolean('is_admin')->default(false);
    });
}

// Create or update admin user
$admin = User::updateOrCreate(
    ['email' => 'admin@mobizilla.com'],
    [
        'name' => 'Admin User',
        'password' => Hash::make('admin123'),
        'is_admin' => true,
        'email_verified_at' => now(),
    ]
);

echo "\nAdmin user has been set up!\n";
echo "Email: admin@mobizilla.com\n";
echo "Password: admin123\n\n";

echo "Starting development server...\n";
exec('php artisan serve --host=127.0.0.1 --port=8000');
