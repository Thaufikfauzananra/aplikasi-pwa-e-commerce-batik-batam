<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Route di bawah ini digunakan untuk menampilkan halaman atau respon
| saat kamu mengakses lewat browser (bukan API).
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel server aktif 🚀',
        'info' => 'Backend API untuk Batik Cindur Batam',
        'api_docs' => [
            'test' => '/api/hello',
            'products' => '/api/products',
            'register' => 'POST /api/register',
            'login' => 'POST /api/login',
        ],
    ]);
});

// Include API routes
require __DIR__ . '/api.php';
