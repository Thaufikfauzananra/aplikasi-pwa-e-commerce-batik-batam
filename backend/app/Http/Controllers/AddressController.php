<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $addresses,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'address' => 'required|string',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Jika ini adalah default, hapus default dari alamat lain
        if ($request->is_default) {
            Address::where('user_id', $request->user()->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $address = Address::create([
            'user_id' => $request->user()->id,
            'label' => $request->label,
            'recipient_name' => $request->recipient_name,
            'recipient_phone' => $request->recipient_phone,
            'province' => $request->province,
            'city' => $request->city,
            'district' => $request->district,
            'postal_code' => $request->postal_code,
            'address' => $request->address,
            'is_default' => $request->is_default ?? false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Alamat berhasil ditambahkan',
            'data' => $address,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'status' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'sometimes|required|string|max:255',
            'recipient_name' => 'sometimes|required|string|max:255',
            'recipient_phone' => 'sometimes|required|string|max:20',
            'province' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'district' => 'sometimes|required|string|max:255',
            'postal_code' => 'sometimes|required|string|max:10',
            'address' => 'sometimes|required|string',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Jika ini adalah default, hapus default dari alamat lain
        if ($request->has('is_default') && $request->is_default) {
            Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $address->update($request->only([
            'label',
            'recipient_name',
            'recipient_phone',
            'province',
            'city',
            'district',
            'postal_code',
            'address',
            'is_default',
        ]));

        return response()->json([
            'status' => true,
            'message' => 'Alamat berhasil diperbarui',
            'data' => $address,
        ], 200);
    }

    public function setDefault(Request $request, $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'status' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }

        // Hapus default dari alamat lain
        Address::where('user_id', $request->user()->id)
            ->where('id', '!=', $id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        // Set alamat ini sebagai default
        $address->update(['is_default' => true]);

        return response()->json([
            'status' => true,
            'message' => 'Alamat default berhasil diubah',
            'data' => $address,
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'status' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }

        $address->delete();

        return response()->json([
            'status' => true,
            'message' => 'Alamat berhasil dihapus',
        ], 200);
    }
}
