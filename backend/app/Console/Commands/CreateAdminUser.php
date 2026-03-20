<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {email : The email of the admin user} {--name= : The name of the admin user} {--password= : The password for the admin user (min 8 characters)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->option('name') ?? 'Admin User';
        $password = $this->option('password') ?? $this->generateRandomPassword();

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address!');
            return 1;
        }

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->warn('A user with this email already exists!');
            if (!$this->confirm('Do you want to update this user to be an admin?')) {
                return 0;
            }
            
            $user = User::where('email', $email)->first();
            $user->is_admin = true;
            $user->save();
            
            $this->info('User updated to admin successfully!');
            return 0;
        }

        // Create new admin user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        $this->info('Admin user created successfully!');
        $this->line('Email: ' . $email);
        $this->line('Password: ' . $password);
        $this->warn('Please change this password after first login!');
        
        return 0;
    }
    
    /**
     * Generate a random password
     *
     * @return string
     */
    protected function generateRandomPassword($length = 12)
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        $password = '';
        
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[random_int(0, strlen($chars) - 1)];
        }
        
        return $password;
    }
}
