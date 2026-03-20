<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class FixAdminLogin extends Command
{
    protected $signature = 'fix:admin-login';
    protected $description = 'Fix admin login by ensuring admin user exists with correct permissions';

    public function handle()
    {
        // Ensure the users table has the is_admin column
        if (!\Schema::hasColumn('users', 'is_admin')) {
            $this->warn('Adding is_admin column to users table...');
            \Artisan::call('migrate');
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

        // Verify Sanctum is installed
        if (!class_exists('Laravel\Sanctum\Sanctum')) {
            $this->warn('Laravel Sanctum is not installed. Installing...');
            exec('composer require laravel/sanctum');
            \Artisan::call('vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"');
            \Artisan::call('migrate');
        }

        // Ensure personal_access_tokens table exists
        if (!\Schema::hasTable('personal_access_tokens')) {
            $this->warn('Creating personal_access_tokens table...');
            \Artisan::call('migrate');
        }

        $this->info('Admin login has been fixed!');
        $this->line('Email: admin@mobizilla.com');
        $this->line('Password: admin123');
        $this->line('Make sure to change this password after logging in!');

        return 0;
    }
}
