<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function createTransaction(Request $request)
    {
        // validasi input
        $request->validate([
            'amount' => 'required|numeric',
            'name' => 'required|string',
            'email' => 'required|email',
        ]);

        // konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = false;
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // data transaksi
        $params = [
            'transaction_details' => [
                'order_id' => uniqid(),
                'gross_amount' => $request->amount,
            ],
            'customer_details' => [
                'first_name' => $request->name,
                'email' => $request->email,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'success' => true,
                'snapToken' => $snapToken,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
