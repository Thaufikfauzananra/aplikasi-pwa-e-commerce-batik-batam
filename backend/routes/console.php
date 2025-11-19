<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| File ini digunakan untuk membuat perintah kustom di terminal
| Jalankan dengan: php artisan <nama_perintah>
|
*/

// Command bawaan inspirasi harian
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Tampilkan kutipan inspiratif dari Laravel');

// Command custom untuk test
Artisan::command('halo:alfi', function () {
    $this->info('Hai Alfi! Laravel console route kamu berjalan 🎉');
})->describe('Menampilkan pesan Halo Alfi di terminal');
