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
        'message' => 'Laravel server aktif 🚀 (route web)',
        'info' => 'Buka /api/hello untuk melihat API versi JSON.',
    ]);
});
//
require __DIR__ . '/api.php';
