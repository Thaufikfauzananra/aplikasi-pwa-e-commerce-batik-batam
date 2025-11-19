<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed admin/login essentials
        $this->call(AdminSeeder::class);

        $products = [
            [
                'name' => 'Blus Pesona Cindur',
                'category' => 'wanita',
                'price' => 249000,
                'stock' => 15,
                'description' => 'Blus batik motif Cindur khas Batam dengan bahan katun premium.',
                'size' => ['S', 'M', 'L', 'XL'],
                'image' => '/wanita1.jpg',
            ],
            [
                'name' => 'Blus Anggun Cindur',
                'category' => 'wanita',
                'price' => 259000,
                'stock' => 12,
                'description' => 'Blus dengan kombinasi motif klasik dan potongan modern.',
                'size' => ['S', 'M', 'L', 'XL'],
                'image' => '/wanita2.jpg',
            ],
            [
                'name' => 'Kemeja Batik Lengan Pendek',
                'category' => 'pria',
                'price' => 299000,
                'stock' => 20,
                'description' => 'Kemeja batik pria dengan motif elegan untuk acara santai.',
                'size' => ['S', 'M', 'L', 'XL', 'XXL'],
                'image' => '/pria1.jpg',
            ],
            [
                'name' => 'Kemeja Batik Lengan Panjang',
                'category' => 'pria',
                'price' => 349000,
                'stock' => 10,
                'description' => 'Pilihan formal dengan bahan lembut dan nyaman.',
                'size' => ['M', 'L', 'XL', 'XXL'],
                'image' => '/pria2.jpg',
            ],
            [
                'name' => 'Dress Batik Seruni',
                'category' => 'wanita',
                'price' => 399000,
                'stock' => 8,
                'description' => 'Dress batik ready-to-wear untuk acara spesial.',
                'size' => ['S', 'M', 'L'],
                'image' => '/wanita3.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['name' => $product['name']], $product);
        }
    }
}