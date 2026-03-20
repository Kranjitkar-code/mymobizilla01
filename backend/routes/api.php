<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\RepairBookingController;
use App\Http\Controllers\Api\OTPController;
use App\Http\Controllers\Api\DataCollectionController;
use App\Http\Controllers\Api\ContentController;

// Public routes
Route::post('/contact', 'App\Http\Controllers\ContactController@store');

// Repair booking routes (public)
Route::prefix('repair')->group(function () {
    Route::post('/book', [RepairBookingController::class, 'store']);
    Route::get('/track/{code}', [RepairBookingController::class, 'track']);
    Route::post('/test-notifications', [RepairBookingController::class, 'testNotifications']);
});

// OTP routes (public)
Route::post('/send-otp', [OTPController::class, 'sendOTP']);

// Data collection routes
Route::post('/store-booking-data', [DataCollectionController::class, 'storeBookingData']);
Route::get('/booking-data', [DataCollectionController::class, 'getBookingData']);
Route::get('/export-booking-data', [DataCollectionController::class, 'exportBookingData']);
Route::get('/booking-stats', [DataCollectionController::class, 'getBookingStats']);

// Content management routes
Route::prefix('content')->group(function () {
    Route::get('/', [ContentController::class, 'index']);
    Route::get('/stats', [ContentController::class, 'getStats']);
    Route::get('/{key}', [ContentController::class, 'getByKey']);
    Route::post('/batch', [ContentController::class, 'getByKeys']);
    Route::post('/', [ContentController::class, 'store']);
    Route::post('/update', [ContentController::class, 'updateByKey']); // For backward compatibility
    Route::get('/settings', [ContentController::class, 'getSettings']); // For website settings
    Route::post('/settings', [ContentController::class, 'updateSettings']); // For website settings
    Route::put('/{id}', [ContentController::class, 'update']);
    Route::delete('/{id}', [ContentController::class, 'destroy']);
});

// Authentication routes
Route::post('/user/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::patch('/users/{id}', [AdminController::class, 'updateUser']);
    });
});