"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Bell, Check, Trash2, ChevronLeft } from "lucide-react";
import api from "../../lib/axios";

export default function NotifikasiPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Jika API belum tersedia, gunakan dummy data
      setNotifications([
        {
          id: 1,
          title: "Pesanan Diterima",
          message: "Pesanan #ORD001 telah diterima dan sedang diproses",
          type: "order",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Produk Baru",
          message: "Batik motif baru telah tersedia! Cek sekarang",
          type: "product",
          is_read: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          title: "Pembayaran Berhasil",
          message: "Pembayaran untuk pesanan #ORD002 telah diterima",
          type: "payment",
          is_read: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      // Update local state saja jika API belum tersedia
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm("Hapus notifikasi ini?")) return;

    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Update local state saja jika API belum tersedia
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Update local state saja jika API belum tersedia
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#704d31] rounded-lg text-white">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#5a3921]">
                Notifikasi
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[#b08968]">
                  {unreadCount} belum dibaca
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#704d31] hover:text-[#5a3921] font-medium"
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#b08968]">Memuat...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e7d9c6] p-8 text-center">
            <Bell size={48} className="mx-auto text-[#b08968] mb-4" />
            <p className="text-[#5a3921] font-medium">Tidak ada notifikasi</p>
            <p className="text-sm text-[#b08968] mt-2">
              Notifikasi baru akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border border-[#e7d9c6] p-4 shadow-sm hover:shadow-md transition ${
                  !notification.is_read ? "border-l-4 border-l-[#704d31]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold ${
                          !notification.is_read
                            ? "text-[#5a3921]"
                            : "text-[#b08968]"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-[#704d31] rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-[#5a3921] mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[#b08968]">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-[#704d31] hover:bg-[#fefaf6] rounded-lg transition"
                        title="Tandai dibaca"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

