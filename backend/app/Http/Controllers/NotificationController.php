<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $notifications,
        ], 200);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'status' => false,
                'message' => 'Notifikasi tidak ditemukan',
            ], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'status' => true,
            'message' => 'Notifikasi ditandai sebagai dibaca',
        ], 200);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'status' => true,
            'message' => 'Semua notifikasi ditandai sebagai dibaca',
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'status' => false,
                'message' => 'Notifikasi tidak ditemukan',
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'status' => true,
            'message' => 'Notifikasi berhasil dihapus',
        ], 200);
    }
}
