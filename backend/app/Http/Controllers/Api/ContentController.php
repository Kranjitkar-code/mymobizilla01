<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

class ContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $startTime = microtime(true);
            
            // Check if we have a cached version
            $cacheKey = 'content_index';
            $cachedContent = cache()->get($cacheKey);
            
            if ($cachedContent) {
                $endTime = microtime(true);
                $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
                
                return response()->json([
                    'success' => true,
                    'data' => $cachedContent,
                    'debug' => [
                        'cache_hit' => true,
                        'duration_ms' => round($duration, 2)
                    ]
                ], 200);
            }
            
            $content = DB::table('content')->get();
            $formattedContent = $content->map(function ($item) {
                return $this->formatContentItem($item);
            })->filter(); // Filter out any null values
            
            // Convert to array to ensure proper JSON serialization
            $formattedContentArray = $formattedContent->toArray();
            
            // Cache for 5 minutes (300 seconds)
            cache()->put($cacheKey, $formattedContentArray, now()->addMinutes(5));
            
            $endTime = microtime(true);
            $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
            
            return response()->json([
                'success' => true,
                'data' => $formattedContentArray,
                'debug' => [
                    'cache_hit' => false,
                    'duration_ms' => round($duration, 2),
                    'record_count' => count($formattedContentArray)
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get database statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_records' => DB::table('content')->count(),
                'total_size_bytes' => 0,
                'average_record_size' => 0,
                'cache_enabled' => cache()->supportsTags() || config('cache.default') !== 'array'
            ];
            
            $records = DB::table('content')->get();
            $totalSize = 0;
            
            foreach ($records as $record) {
                $size = strlen($record->key) + strlen($record->value) + strlen($record->type);
                $totalSize += $size;
            }
            
            $stats['total_size_bytes'] = $totalSize;
            $stats['average_record_size'] = $stats['total_records'] > 0 ? $totalSize / $stats['total_records'] : 0;
            
            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stats: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific content item by key
     */
    public function getByKey($key)
    {
        try {
            $startTime = microtime(true);
            
            // Check if we have a cached version
            $cacheKey = 'content_item_' . $key;
            $cachedContent = cache()->get($cacheKey);
            
            if ($cachedContent) {
                $endTime = microtime(true);
                $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
                
                return response()->json([
                    'success' => true,
                    'data' => $cachedContent,
                    'debug' => [
                        'cache_hit' => true,
                        'duration_ms' => round($duration, 2)
                    ]
                ], 200);
            }
            
            $item = DB::table('content')->where('key', $key)->first();
            
            if (!$item) {
                return response()->json([
                    'success' => false,
                    'message' => 'Content not found'
                ], 404);
            }
            
            $formattedItem = $this->formatContentItem($item);
            
            // Return null if formatting failed
            if (!$formattedItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to format content item'
                ], 500);
            }
            
            // Cache for 5 minutes
            cache()->put($cacheKey, $formattedItem, now()->addMinutes(5));
            
            $endTime = microtime(true);
            $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
            
            return response()->json([
                'success' => true,
                'data' => $formattedItem,
                'debug' => [
                    'cache_hit' => false,
                    'duration_ms' => round($duration, 2)
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get multiple specific content items by keys
     */
    public function getByKeys(Request $request)
    {
        try {
            $validated = $request->validate([
                'keys' => 'required|array',
                'keys.*' => 'string'
            ]);
            
            $keys = $validated['keys'];
            $startTime = microtime(true);
            
            // Try to get from cache first
            $cacheKey = 'content_items_' . md5(implode(',', $keys));
            $cachedContent = cache()->get($cacheKey);
            
            if ($cachedContent) {
                $endTime = microtime(true);
                $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
                
                return response()->json([
                    'success' => true,
                    'data' => $cachedContent,
                    'debug' => [
                        'cache_hit' => true,
                        'duration_ms' => round($duration, 2)
                    ]
                ], 200);
            }
            
            $items = DB::table('content')->whereIn('key', $keys)->get();
            $formattedItems = $items->map(function ($item) {
                return $this->formatContentItem($item);
            })->filter(); // Filter out any null values
            
            // Convert to array to ensure proper JSON serialization
            $formattedItemsArray = $formattedItems->toArray();
            
            // Cache for 5 minutes
            cache()->put($cacheKey, $formattedItemsArray, now()->addMinutes(5));
            
            $endTime = microtime(true);
            $duration = ($endTime - $startTime) * 1000; // Convert to milliseconds
            
            return response()->json([
                'success' => true,
                'data' => $formattedItemsArray,
                'debug' => [
                    'cache_hit' => false,
                    'duration_ms' => round($duration, 2),
                    'requested_count' => count($keys),
                    'returned_count' => count($formattedItemsArray)
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'key' => 'required|string|max:255',
                'value' => 'required|string',
                'type' => 'required|string|in:text,html,markdown',
            ]);

            // Clear cache when content is updated
            cache()->forget('content_index');
            cache()->forget('content_stats');

            // Check if content with this key already exists
            $existing = DB::table('content')->where('key', $validated['key'])->first();
            
            if ($existing) {
                // Update existing record
                $content = DB::table('content')
                    ->where('key', $validated['key'])
                    ->update([
                        'value' => $validated['value'],
                        'type' => $validated['type'],
                        'updated_at' => now(),
                    ]);
                    
                $updatedContent = DB::table('content')->where('key', $validated['key'])->first();
                
                // Clear specific item cache
                cache()->forget('content_item_' . $validated['key']);
                
                // Format the updated content
                $formattedContent = $this->formatContentItem($updatedContent);
                
                // Return null if formatting failed
                if (!$formattedContent) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to format content item'
                    ], 500);
                }
                
                return response()->json([
                    'success' => true,
                    'data' => [$formattedContent],
                    'message' => 'Content updated successfully'
                ], 200);
            } else {
                // Create new record
                $id = DB::table('content')->insertGetId([
                    'key' => $validated['key'],
                    'value' => $validated['value'],
                    'type' => $validated['type'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $newContent = DB::table('content')->where('id', $id)->first();
                
                // Clear index cache to include new item
                cache()->forget('content_index');
                
                // Format the new content
                $formattedContent = $this->formatContentItem($newContent);
                
                // Return null if formatting failed
                if (!$formattedContent) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to format content item'
                    ], 500);
                }
                
                return response()->json([
                    'success' => true,
                    'data' => [$formattedContent],
                    'message' => 'Content created successfully'
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'value' => 'required|string',
                'type' => 'required|string|in:text,html,markdown',
            ]);

            // Get the key to clear specific item cache
            $existing = DB::table('content')->where('id', $id)->first();
            if ($existing) {
                cache()->forget('content_item_' . $existing->key);
            }

            // Check if content exists
            if (!$existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Content not found'
                ], 404);
            }

            $content = DB::table('content')->where('id', $id)->update([
                'value' => $validated['value'],
                'type' => $validated['type'],
                'updated_at' => now(),
            ]);

            $updatedContent = DB::table('content')->where('id', $id)->first();
            
            // Clear index cache to reflect changes
            cache()->forget('content_index');
            
            // Format the updated content
            $formattedContent = $this->formatContentItem($updatedContent);
            
            // Return null if formatting failed
            if (!$formattedContent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to format content item'
                ], 500);
            }
            
            return response()->json([
                'success' => true,
                'data' => [$formattedContent],
                'message' => 'Content updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update content by key (for backward compatibility with old API)
     */
    public function updateByKey(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|string', // This is actually the key in the old API
                'content' => 'required|string',
                'title' => 'nullable|string',
                'type' => 'nullable|string|in:text,image,html',
                'section' => 'nullable|string|in:home,services,about,contact,settings,footer',
            ]);

            // Clear cache when content is updated
            cache()->forget('content_index');
            cache()->forget('content_item_' . $validated['id']);

            // Check if content exists
            $existing = DB::table('content')->where('key', $validated['id'])->first();
            
            if ($existing) {
                // Update existing record
                $updateData = [
                    'value' => $validated['content'],
                    'updated_at' => now(),
                ];
                
                // Update type if provided
                if (!empty($validated['type'])) {
                    // Map old types to new types
                    $typeMapping = [
                        'text' => 'text',
                        'image' => 'text', // Images would be stored as text (URL)
                        'html' => 'html'
                    ];
                    $updateData['type'] = $typeMapping[$validated['type']] ?? 'text';
                }
                
                DB::table('content')
                    ->where('key', $validated['id'])
                    ->update($updateData);
                    
                $updatedContent = DB::table('content')->where('key', $validated['id'])->first();
                
                // Clear caches
                cache()->forget('content_index');
                cache()->forget('content_item_' . $validated['id']);
                
                // Format the updated content
                $formattedContent = $this->formatContentItem($updatedContent);
                
                // Return null if formatting failed
                if (!$formattedContent) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to format content item'
                    ], 500);
                }
                
                return response()->json([
                    'success' => true,
                    'data' => [$formattedContent],
                    'message' => 'Content updated successfully'
                ], 200);
            } else {
                // Create new record
                $type = 'text';
                if (!empty($validated['type'])) {
                    $typeMapping = [
                        'text' => 'text',
                        'image' => 'text',
                        'html' => 'html'
                    ];
                    $type = $typeMapping[$validated['type']] ?? 'text';
                }
                
                $id = DB::table('content')->insertGetId([
                    'key' => $validated['id'],
                    'value' => $validated['content'],
                    'type' => $type,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $newContent = DB::table('content')->where('id', $id)->first();
                
                // Clear index cache to include new item
                cache()->forget('content_index');
                
                // Format the new content
                $formattedContent = $this->formatContentItem($newContent);
                
                // Return null if formatting failed
                if (!$formattedContent) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to format content item'
                    ], 500);
                }
                
                return response()->json([
                    'success' => true,
                    'data' => [$formattedContent],
                    'message' => 'Content created successfully'
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get website settings
     */
    public function getSettings()
    {
        try {
            // For now, we'll return some default settings
            // In a real implementation, these would be stored in the database
            $settings = [
                'siteTitle' => 'Mobizilla',
                'contactPhone' => '+1 (555) 123-4567',
                'contactEmail' => 'info@mobizilla.com',
                'contactAddress' => '123 Tech Street, San Francisco, CA 94103'
            ];
            
            return response()->json([
                'success' => true,
                'data' => $settings
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update website settings
     */
    public function updateSettings(Request $request)
    {
        try {
            // For now, we'll just return success
            // In a real implementation, these would be stored in the database
            $validated = $request->validate([
                'siteTitle' => 'nullable|string',
                'contactPhone' => 'nullable|string',
                'contactEmail' => 'nullable|string|email',
                'contactAddress' => 'nullable|string',
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $validated,
                'message' => 'Settings updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Get the key to clear specific item cache
            $existing = DB::table('content')->where('id', $id)->first();
            if ($existing) {
                cache()->forget('content_item_' . $existing->key);
            }

            // Check if content exists
            if (!$existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Content not found'
                ], 404);
            }

            $deleted = DB::table('content')->where('id', $id)->delete();
            
            if ($deleted) {
                // Clear index cache to reflect deletion
                cache()->forget('content_index');
                
                return response()->json([
                    'success' => true,
                    'message' => 'Content deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Content not found'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete content: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format content item to match the old API structure
     */
    private function formatContentItem($item)
    {
        if (!$item) return null;
        
        // Ensure all required fields are present
        if (!isset($item->key) || !isset($item->value) || !isset($item->type) || !isset($item->updated_at)) {
            return null;
        }
        
        // Map the new database structure to the old API structure
        return [
            'id' => $item->key, // Use key as ID to match old API
            'title' => '', // Title not stored in new schema, set to empty string
            'content' => $item->value,
            'type' => $item->type,
            'section' => 'home', // Default section for all content
            'lastModified' => $item->updated_at
        ];
    }
}