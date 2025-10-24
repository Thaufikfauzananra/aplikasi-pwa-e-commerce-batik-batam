<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;

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

// 🔹 PRODUK SAMPLE
Route::get('/products', function () {
    return response()->json([
        [
            'id' => 1,
            'name' => 'Kemeja Batik Lengan Panjang',
            'price' => 299000,
            'image' => '/wanita1.jpg',
        ],
        [
            'id' => 2,
            'name' => 'Dress Tenun Cindur',
            'price' => 299000,
            'image' => '/wanita2.jpg',
        ],
        [
            'id' => 3,
            'name' => 'Kemeja Batik Pendek',
            'price' => 199000,
            'image' => '/pria2.jpg',
        ],
    ]);
});

// 🔹 REGISTER (contoh Auth)
Route::post('/register', [AuthController::class, 'register']);

// 🔹 MIDTRANS PAYMENT GATEWAY
Route::post('/create-transaction', [PaymentController::class, 'createTransaction']);
