<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trade;
use Illuminate\Http\Request;

class TradeController extends Controller
{
    // Get all trades for the authenticated user
    public function index()
    {
        $trades = Trade::with(['offeredProduct', 'requestedProduct'])
            ->where('user_id', auth()->id())
            ->orWhere('requested_user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($trades);
    }

    // Create a new trade request
    public function store(Request $request)
    {
        $validated = $request->validate([
            'offered_product_id' => 'required|exists:products,id',
            'requested_product_id' => 'required|exists:products,id',
            'message' => 'nullable|string'
        ]);

        // Verify product ownership
        $offeredProduct = \App\Models\Product::findOrFail($validated['offered_product_id']);
        if ($offeredProduct->user_id !== auth()->id()) {
            return response()->json(['message' => 'You can only offer products you own'], 403);
        }

        $requestedProduct = \App\Models\Product::findOrFail($validated['requested_product_id']);
        if ($requestedProduct->user_id === auth()->id()) {
            return response()->json(['message' => 'You cannot request your own products'], 403);
        }

        $trade = Trade::create([
            'user_id' => auth()->id(),
            'requested_user_id' => $requestedProduct->user_id,
            'status' => 'pending',
            ...$validated
        ]);

        return response()->json($trade, 201);
    }

    // Update trade status (accept/reject)
    public function updateStatus(Request $request, $id)
    {
        $trade = Trade::findOrFail($id);
        
        if ($trade->requested_user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $trade->update($validated);

        if ($validated['status'] === 'accepted') {
            // Update product ownership
            $offeredProduct = \App\Models\Product::find($trade->offered_product_id);
            $requestedProduct = \App\Models\Product::find($trade->requested_product_id);

            $tempUserId = $offeredProduct->user_id;
            $offeredProduct->update(['user_id' => $requestedProduct->user_id]);
            $requestedProduct->update(['user_id' => $tempUserId]);
        }

        return response()->json($trade);
    }

    // Cancel a trade request
    public function cancel($id)
    {
        $trade = Trade::findOrFail($id);
        
        if ($trade->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($trade->status !== 'pending') {
            return response()->json(['message' => 'Can only cancel pending trades'], 400);
        }

        $trade->update(['status' => 'cancelled']);
        return response()->json($trade);
    }
}
