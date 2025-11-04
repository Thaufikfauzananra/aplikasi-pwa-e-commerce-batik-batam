<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    // Path untuk menyimpan produk baru
    private function getProductsFilePath()
    {
        return storage_path('app/products.json');
    }

    // Load products dari file
    private function loadProducts()
    {
        $filePath = $this->getProductsFilePath();
        if (File::exists($filePath)) {
            $content = File::get($filePath);
            return json_decode($content, true) ?? [];
        }
        return [];
    }

    // Save products ke file
    private function saveProducts($products)
    {
        $filePath = $this->getProductsFilePath();
        File::ensureDirectoryExists(dirname($filePath));
        File::put($filePath, json_encode($products, JSON_PRETTY_PRINT));
    }

    // Get next ID
    private function getNextId()
    {
        $products = $this->loadProducts();
        if (empty($products)) {
            return 6; // Start dari 6 karena ada 5 sample products
        }
        $maxId = max(array_column($products, 'id'));
        return $maxId + 1;
    }
    /**
     * Get all products
     */
    public function index()
    {
        // Sample data - nanti bisa diganti dengan query database
        $sampleProducts = [
            [
                'id' => 1,
                'name' => 'Blus Pesona Cindur',
                'price' => 249000,
                'image' => '/wanita1.jpg',
                'category' => 'wanita',
                'description' => 'Blus batik dengan motif cindur yang elegan dan nyaman digunakan.',
                'size' => ['S', 'M', 'L', 'XL'],
                'stock' => 15,
            ],
            [
                'id' => 2,
                'name' => 'Blus Anggun Cindur',
                'price' => 249000,
                'image' => '/wanita2.jpg',
                'category' => 'wanita',
                'description' => 'Blus batik dengan desain modern dan motif tradisional.',
                'size' => ['S', 'M', 'L', 'XL'],
                'stock' => 10,
            ],
            [
                'id' => 3,
                'name' => 'Kemeja Batik Lengan Pendek',
                'price' => 299000,
                'image' => '/pria1.jpg',
                'category' => 'pria',
                'description' => 'Kemeja batik pria dengan kualitas premium.',
                'size' => ['S', 'M', 'L', 'XL', 'XXL'],
                'stock' => 20,
            ],
            [
                'id' => 4,
                'name' => 'Blus Seri Cindur',
                'price' => 249000,
                'image' => '/wanita3.jpg',
                'category' => 'wanita',
                'description' => 'Blus batik seri cindur dengan motif khas Batam.',
                'size' => ['S', 'M', 'L', 'XL'],
                'stock' => 12,
            ],
            [
                'id' => 5,
                'name' => 'Kemeja Batik Lengan Panjang',
                'price' => 349000,
                'image' => '/pria2.jpg',
                'category' => 'pria',
                'description' => 'Kemeja batik formal untuk acara resmi.',
                'size' => ['M', 'L', 'XL', 'XXL'],
                'stock' => 8,
            ],
        ];

        // Load products dari file storage
        $savedProducts = $this->loadProducts();
        
        // Gabungkan sample products dengan products yang baru ditambahkan
        $allProducts = array_merge($sampleProducts, $savedProducts);

        return response()->json([
            'status' => true,
            'data' => $allProducts,
        ], 200);
    }

    /**
     * Get single product by ID
     */
    public function show($id)
    {
        // Sample data - nanti bisa diganti dengan query database
        $sampleProducts = [
            [
                'id' => 1,
                'name' => 'Blus Pesona Cindur',
                'price' => 249000,
                'image' => '/wanita1.jpg',
                'category' => 'wanita',
                'description' => 'Blus batik dengan motif cindur yang elegan dan nyaman digunakan. Terbuat dari bahan katun berkualitas tinggi dengan motif tradisional yang indah.',
                'size' => ['S', 'M', 'L', 'XL'],
                'stock' => 15,
            ],
            [
                'id' => 2,
                'name' => 'Blus Anggun Cindur',
                'price' => 249000,
                'image' => '/wanita2.jpg',
                'category' => 'wanita',
                'description' => 'Blus batik dengan desain modern dan motif tradisional.',
                'size' => ['S', 'M', 'L', 'XL'],
                'stock' => 10,
            ],
            [
                'id' => 3,
                'name' => 'Kemeja Batik Lengan Pendek',
                'price' => 299000,
                'image' => '/pria1.jpg',
                'category' => 'pria',
                'description' => 'Kemeja batik pria dengan kualitas premium.',
                'size' => ['S', 'M', 'L', 'XL', 'XXL'],
                'stock' => 20,
            ],
        ];

        // Load products dari file storage
        $savedProducts = $this->loadProducts();
        
        // Gabungkan sample products dengan products yang baru ditambahkan
        $allProducts = array_merge($sampleProducts, $savedProducts);
        
        // Cari produk berdasarkan ID
        $product = null;
        foreach ($allProducts as $p) {
            if ($p['id'] == $id) {
                $product = $p;
                break;
            }
        }

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $product,
        ], 200);
    }

    /**
     * Create new product (Admin only)
     */
    public function store(Request $request)
    {
        // Debug: Log request data
        \Log::info('Store Product Request', [
            'all_input' => $request->all(),
            'size_input' => $request->input('size'),
            'has_size' => $request->has('size'),
        ]);
        
        // Handle size array dari FormData - sama seperti update
        $sizeArray = [];
        
        // Method 1: Coba dari input('size')
        $sizeInput = $request->input('size');
        if (is_array($sizeInput)) {
            $sizeArray = $sizeInput;
        } elseif (is_string($sizeInput)) {
            $decoded = json_decode($sizeInput, true);
            if (is_array($decoded)) {
                $sizeArray = $decoded;
            } else {
                $sizeArray = array_filter(explode(',', $sizeInput));
            }
        }
        
        // Method 2: Cek dari size_json (backup dari frontend)
        if (empty($sizeArray)) {
            $sizeJson = $request->input('size_json');
            if (is_string($sizeJson)) {
                $decoded = json_decode($sizeJson, true);
                if (is_array($decoded)) {
                    $sizeArray = $decoded;
                }
            }
        }
        
        // Method 3: Cek langsung dari $_POST
        if (empty($sizeArray) && isset($_POST['size']) && is_array($_POST['size'])) {
            $sizeArray = $_POST['size'];
        }
        
        // Filter empty values
        $sizeArray = array_filter($sizeArray, function($size) {
            return !empty($size) && is_string($size);
        });
        $sizeArray = array_values($sizeArray); // Re-index
        
        \Log::info('Processed size array for store', ['sizeArray' => $sizeArray]);
        
        // Validasi input dengan error handling yang lebih baik
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        }
        
        // Validasi size secara manual
        if (empty($sizeArray)) {
            return response()->json([
                'status' => false,
                'message' => 'Ukuran produk harus dipilih minimal satu',
                'errors' => ['size' => ['Ukuran produk harus dipilih minimal satu']],
            ], 422);
        }
        
        $validSizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $invalidSizes = [];
        foreach ($sizeArray as $size) {
            if (!in_array($size, $validSizes)) {
                $invalidSizes[] = $size;
            }
        }
        
        if (!empty($invalidSizes)) {
            return response()->json([
                'status' => false,
                'message' => 'Ukuran tidak valid',
                'errors' => ['size' => ["Ukuran '" . implode("', '", $invalidSizes) . "' tidak valid. Pilih dari: " . implode(', ', $validSizes)]],
            ], 422);
        }
        
        // Tambahkan size ke validated data
        $validated['size'] = array_unique($sizeArray);

        // Handle image upload (optional)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('products', 'public');
        }

        // Load existing products
        $products = $this->loadProducts();

        // Create new product
        $appUrl = env('APP_URL', 'http://127.0.0.1:8000');
        $product = [
            'id' => $this->getNextId(),
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => (float)$validated['price'],
            'stock' => (int)$validated['stock'],
            'description' => $validated['description'],
            'size' => $validated['size'],
            'image' => $imagePath ? $appUrl . '/storage/' . $imagePath : '/logo_batik.jpg',
            'created_at' => now()->toISOString(),
        ];

        // Tambahkan produk baru
        $products[] = $product;
        
        // Simpan ke file
        $this->saveProducts($products);

        return response()->json([
            'status' => true,
            'message' => 'Produk berhasil ditambahkan',
            'data' => $product,
        ], 201);
    }

    /**
     * Update product (Admin only)
     * Support both PUT and POST (method spoofing)
     */
    public function update(Request $request, $id)
    {
        // Handle method spoofing untuk FormData
        // Jika ada _method=PUT, kita anggap sebagai PUT request
        if ($request->has('_method') && $request->input('_method') === 'PUT') {
            // Remove _method dari request untuk tidak mengganggu validasi
            $request->merge(['_method' => null]);
        }
        
        // Debug: Log request data
        \Log::info('Update Product Request', [
            'id' => $id,
            'method' => $request->method(),
            'all_input' => $request->all(),
            'size_input' => $request->input('size'),
            'has_size' => $request->has('size'),
            'post_data' => $_POST ?? [],
        ]);
        
        // Handle size array dari FormData
        // Coba berbagai cara untuk mendapatkan size array
        $sizeArray = [];
        
        // Method 1: Coba dari input('size')
        $sizeInput = $request->input('size');
        if (is_array($sizeInput)) {
            $sizeArray = $sizeInput;
        } elseif (is_string($sizeInput)) {
            // Jika string, coba decode JSON
            $decoded = json_decode($sizeInput, true);
            if (is_array($decoded)) {
                $sizeArray = $decoded;
            } else {
                // Jika bukan JSON, coba split by comma
                $sizeArray = array_filter(explode(',', $sizeInput));
            }
        }
        
        // Method 2: Jika masih kosong, coba dari request->get('size')
        if (empty($sizeArray)) {
            $sizeFromGet = $request->get('size');
            if (is_array($sizeFromGet)) {
                $sizeArray = $sizeFromGet;
            }
        }
        
        // Method 3: Cek langsung dari $_POST atau $_REQUEST (untuk FormData)
        if (empty($sizeArray) && isset($_POST['size']) && is_array($_POST['size'])) {
            $sizeArray = $_POST['size'];
        }
        
        // Method 4: Cek dari size_json (backup dari frontend)
        if (empty($sizeArray)) {
            $sizeJson = $request->input('size_json');
            if (is_string($sizeJson)) {
                $decoded = json_decode($sizeJson, true);
                if (is_array($decoded)) {
                    $sizeArray = $decoded;
                }
            }
        }
        
        // Filter empty values dan validasi
        $sizeArray = array_filter($sizeArray, function($size) {
            return !empty($size) && is_string($size);
        });
        $sizeArray = array_values($sizeArray); // Re-index
        
        \Log::info('Processed size array', ['sizeArray' => $sizeArray]);
        
        // Validasi input dengan error handling yang lebih baik
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        }
        
        // Validasi size secara manual
        if (empty($sizeArray) || !is_array($sizeArray) || count($sizeArray) === 0) {
            \Log::warning('Size validation failed', [
                'sizeArray' => $sizeArray,
                'isEmpty' => empty($sizeArray),
                'isArray' => is_array($sizeArray),
                'count' => is_array($sizeArray) ? count($sizeArray) : 0,
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Ukuran produk harus dipilih minimal satu',
                'errors' => [
                    'size' => ['Ukuran produk harus dipilih minimal satu. Pastikan memilih ukuran S, M, L, XL, atau XXL.']
                ],
            ], 422);
        }
        
        $validSizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $invalidSizes = [];
        foreach ($sizeArray as $size) {
            if (!in_array($size, $validSizes)) {
                $invalidSizes[] = $size;
            }
        }
        
        if (!empty($invalidSizes)) {
            return response()->json([
                'status' => false,
                'message' => 'Ukuran tidak valid',
                'errors' => [
                    'size' => ["Ukuran '" . implode("', '", $invalidSizes) . "' tidak valid. Pilih dari: " . implode(', ', $validSizes)]
                ],
            ], 422);
        }
        
        // Tambahkan size ke validated data
        $validated['size'] = array_unique($sizeArray);

        // Sample data untuk update (read-only, tidak bisa diupdate)
        $sampleProducts = [
            ['id' => 1, 'name' => 'Blus Pesona Cindur', 'price' => 249000, 'image' => '/wanita1.jpg', 'category' => 'wanita', 'description' => 'Blus batik dengan motif cindur yang elegan dan nyaman digunakan.', 'size' => ['S', 'M', 'L', 'XL'], 'stock' => 15],
            ['id' => 2, 'name' => 'Blus Anggun Cindur', 'price' => 249000, 'image' => '/wanita2.jpg', 'category' => 'wanita', 'description' => 'Blus batik dengan desain modern dan motif tradisional.', 'size' => ['S', 'M', 'L', 'XL'], 'stock' => 10],
            ['id' => 3, 'name' => 'Kemeja Batik Lengan Pendek', 'price' => 299000, 'image' => '/pria1.jpg', 'category' => 'pria', 'description' => 'Kemeja batik pria dengan kualitas premium.', 'size' => ['S', 'M', 'L', 'XL', 'XXL'], 'stock' => 20],
            ['id' => 4, 'name' => 'Blus Seri Cindur', 'price' => 249000, 'image' => '/wanita3.jpg', 'category' => 'wanita', 'description' => 'Blus batik seri cindur dengan motif khas Batam.', 'size' => ['S', 'M', 'L', 'XL'], 'stock' => 12],
            ['id' => 5, 'name' => 'Kemeja Batik Lengan Panjang', 'price' => 349000, 'image' => '/pria2.jpg', 'category' => 'pria', 'description' => 'Kemeja batik formal untuk acara resmi.', 'size' => ['M', 'L', 'XL', 'XXL'], 'stock' => 8],
        ];

        // Load products dari file
        $products = $this->loadProducts();
        
        // Cek apakah produk ada di saved products (bisa diupdate)
        $foundProduct = null;
        $foundIndex = -1;
        foreach ($products as $index => $p) {
            if ($p['id'] == $id) {
                $foundProduct = &$products[$index];
                $foundIndex = $index;
                break;
            }
        }
        
        // Jika tidak ada di saved products, cek apakah produk sample (tidak bisa diupdate)
        if (!$foundProduct) {
            foreach ($sampleProducts as $p) {
                if ($p['id'] == $id) {
                    // Produk sample tidak bisa diupdate, return error
                    return response()->json([
                        'status' => false,
                        'message' => 'Produk sample tidak bisa diupdate. Silakan tambah produk baru untuk mengedit.',
                    ], 403);
                }
            }
        }

        if (!$foundProduct) {
            return response()->json([
                'status' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // Handle image upload (optional)
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('products', 'public');
            $appUrl = env('APP_URL', 'http://127.0.0.1:8000');
            $foundProduct['image'] = $appUrl . '/storage/' . $imagePath;
        }

        // Update product data
        $foundProduct['name'] = $validated['name'];
        $foundProduct['category'] = $validated['category'];
        $foundProduct['price'] = (float)$validated['price'];
        $foundProduct['stock'] = (int)$validated['stock'];
        $foundProduct['description'] = $validated['description'];
        $foundProduct['size'] = $validated['size'];
        $foundProduct['updated_at'] = now()->toISOString();
        
        // Simpan kembali ke file
        $this->saveProducts($products);

        return response()->json([
            'status' => true,
            'message' => 'Produk berhasil diupdate',
            'data' => $foundProduct,
        ], 200);
    }

    /**
     * Delete product (Admin only)
     */
    public function destroy($id)
    {
        // Load products dari file
        $products = $this->loadProducts();
        
        // Cari produk di saved products
        $foundIndex = -1;
        foreach ($products as $index => $product) {
            if ($product['id'] == $id) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex >= 0) {
            // Hapus dari array
            unset($products[$foundIndex]);
            $products = array_values($products); // Re-index array
            
            // Simpan kembali ke file
            $this->saveProducts($products);
            
            return response()->json([
                'status' => true,
                'message' => 'Produk berhasil dihapus',
            ], 200);
        }

        // Jika tidak ada di saved products, kemungkinan produk sample (tidak bisa dihapus)
        return response()->json([
            'status' => false,
            'message' => 'Produk tidak ditemukan atau tidak bisa dihapus (produk sample tidak bisa dihapus)',
        ], 404);
    }
}

