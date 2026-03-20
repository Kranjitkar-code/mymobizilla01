<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Route::get('/temp/update-admin-pass', function() {
    $user = User::where('email', 'admin@mobizilla.com')->first();
    
    if (!$user) {
        return response()->json(['error' => 'Admin user not found'], 404);
    }
    
    $user->password = Hash::make('admin123');
    $user->is_admin = true;
    $user->save();
    
    return response()->json([
        'message' => 'Password updated successfully',
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'is_admin' => $user->is_admin
        ]
    ]);
});
