<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\RepairOrder;
use App\Models\TradeRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Get all products
    public function index()
    {
        $products = Product::with('category', 'user')
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->paginate(12);
            
        return response()->json($products);
    }

    // Get a single product
    public function show($id)
    {
        $product = Product::with('category', 'user')
            ->findOrFail($id);
            
        return response()->json($product);
    }

    // Create a new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'condition' => 'required|in:new,used,refurbished',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $product = Product::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['path' => $path]);
            }
        }

        return response()->json($product, 201);
    }

    // Update a product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric',
            'category_id' => 'exists:categories,id',
            'condition' => 'in:new,used,refurbished',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $product->update($validated);

        if ($request->hasFile('images')) {
            // Remove old images
            $product->images()->delete();
            
            // Add new images
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['path' => $path]);
            }
        }

        return response()->json($product);
    }

    // Delete a product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
