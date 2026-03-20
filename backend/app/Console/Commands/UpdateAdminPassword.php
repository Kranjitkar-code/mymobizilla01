<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class UpdateAdminPassword extends Command
{
    protected $signature = 'admin:update-password {email} {password?}';
    protected $description = 'Update admin user password';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password') ?? 'admin123';

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            return 1;
        }

        $user->password = Hash::make($password);
        $user->is_admin = true;
        $user->save();

        $this->info("Password updated successfully for: {$user->email}");
        $this->line("New password: {$password}");
        
        return 0;
    }
}
