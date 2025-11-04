<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat akun admin default
        User::updateOrCreate(
            ['email' => 'admin@batikcindurbatam.com'],
            [
                'name' => 'Administrator',
                'email' => 'admin@batikcindurbatam.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        echo "✅ Akun admin berhasil dibuat!\n";
        echo "📧 Email: admin@batikcindurbatam.com\n";
        echo "🔑 Password: admin123\n";
    }
}

