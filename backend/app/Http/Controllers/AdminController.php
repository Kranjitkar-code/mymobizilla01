<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'user' => auth()->user(),
            'stats' => [
                'users_count' => \App\Models\User::count(),
                // Add more stats as needed
            ]
        ]);
    }

    public function users()
    {
        return response()->json([
            'users' => \App\Models\User::paginate(10)
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'is_admin' => 'boolean'
        ]);

        $user->update($validated);
        return response()->json(['user' => $user]);
    }
}
