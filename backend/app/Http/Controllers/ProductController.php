<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Get all products from database (no dummy data)
     */
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $products,
        ], 200);
    }

    /**
     * Get single product by ID (database only)
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (! $product) {
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
     * Create new product (Admin only, database)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'size' => 'nullable|array',
            'size.*' => 'string',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp,jfif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }
        $validated = $validator->validated();

        $data = $validated;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $product = Product::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Produk berhasil ditambahkan',
            'data' => $product,
        ], 201);
    }

    /**
     * Update product (Admin only, database)
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'status' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'description' => 'nullable|string',
            'size' => 'nullable|array',
            'size.*' => 'string',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp,jfif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }
        $validated = $validator->validated();

        $data = $validated;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $product->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Produk berhasil diupdate',
            'data' => $product,
        ], 200);
    }

    /**
     * Delete product (Admin only, database)
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'status' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Produk berhasil dihapus',
        ], 200);
    }
}

