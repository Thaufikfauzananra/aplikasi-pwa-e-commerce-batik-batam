<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AddressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ini adalah route untuk API backend Laravel kamu.
| Frontend Next.js (http://localhost:3000) akan memanggil endpoint di sini.
|
*/

// 🔹 TEST ENDPOINT
Route::get('/hello', function () {
    return response()->json([
        'message' => 'Halo dari Laravel Backend! 🎉',
        'status' => 'success',
    ]);
});

// 🔹 AUTHENTICATION (Public Routes)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🔹 PRODUCTS (Public Routes)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// 🔹 PROTECTED ROUTES (Perlu Authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    
    // Addresses
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::put('/addresses/{id}/set-default', [AddressController::class, 'setDefault']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    
    // MIDTRANS PAYMENT GATEWAY
    Route::post('/create-transaction', [PaymentController::class, 'createTransaction']);
    
    // PRODUCTS (Admin only - CRUD)
    Route::post('/products', [ProductController::class, 'store']);
    Route::match(['put', 'post'], '/products/{id}', [ProductController::class, 'update']); // Support both PUT and POST (method spoofing)
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});
