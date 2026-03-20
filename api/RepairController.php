<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RepairOrder;
use Illuminate\Http\Request;

class RepairController extends Controller
{
    // Get all repair orders for the authenticated user
    public function index()
    {
        $repairs = RepairOrder::where('user_id', auth()->id())
            ->with('device', 'services')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($repairs);
    }

    // Get a single repair order
    public function show($id)
    {
        $repair = RepairOrder::with('device', 'services')
            ->findOrFail($id);
            
        if ($repair->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
            
        return response()->json($repair);
    }

    // Create a new repair order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'device_type' => 'required|string',
            'device_model' => 'required|string',
            'issue_description' => 'required|string',
            'services' => 'required|array',
            'services.*' => 'exists:repair_services,id',
            'preferred_date' => 'required|date|after:today',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $repair = RepairOrder::create([
            'user_id' => auth()->id(),
            'status' => 'pending',
            ...$validated
        ]);

        $repair->services()->attach($request->services);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('repairs', 'public');
                $repair->images()->create(['path' => $path]);
            }
        }

        return response()->json($repair, 201);
    }

    // Update repair order status
    public function updateStatus(Request $request, $id)
    {
        $repair = RepairOrder::findOrFail($id);
        
        if ($repair->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled'
        ]);

        $repair->update($validated);

        return response()->json($repair);
    }

    // Get repair services list
    public function services()
    {
        $services = \App\Models\RepairService::all();
        return response()->json($services);
    }

    // Get repair tracking information
    public function track($code)
    {
        $repair = RepairOrder::where('tracking_code', $code)->firstOrFail();
        return response()->json($repair);
    }
}
