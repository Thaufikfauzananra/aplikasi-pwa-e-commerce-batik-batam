"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import BottomNav from "../../../components/BottomNav";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  Receipt, 
  Download, 
  Printer,
  ChevronRight,
  CheckCircle,
  XCircle,
  Truck,
  Box
} from "lucide-react";
import { resolveImageUrl } from "../../../lib/image";

export default function DetailPesananPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    // Load order from localStorage
    const savedOrders = localStorage.getItem("orderHistory");
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const foundOrder = orders.find((o) => o.id === params.id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
    setLoading(false);
  }, [params.id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pesanan Selesai":
        return <CheckCircle size={20} className="text-green-500" />;
      case "Pesanan Dibatalkan":
        return <XCircle size={20} className="text-red-500" />;
      case "Sedang Dikirim":
        return <Truck size={20} className="text-blue-500" />;
      case "Sedang Diproses":
        return <Box size={20} className="text-amber-500" />;
      default:
        return <Package size={20} className="text-[#7b4d2a]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pesanan Selesai":
        return "text-green-600 bg-green-50 border-green-200";
      case "Pesanan Dibatalkan":
        return "text-red-600 bg-red-50 border-red-200";
      case "Sedang Dikirim":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Sedang Diproses":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-[#7b4d2a] bg-[#fdf3ec] border-[#e3d6c5]";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704d31]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-transparent pb-24 md:pb-0">
        <Navbar title="Detail Pesanan" showBack />
        <div className="luxury-container flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Package size={80} className="text-[#e3d6c5] mb-4" />
          <h2 className="text-xl font-semibold text-[#5c3316]">Pesanan tidak ditemukan</h2>
          <p className="text-sm text-[#5c3316]/70 mt-2">
            Pesanan dengan ID {params.id} tidak ada dalam riwayat.
          </p>
          <Link href="/riwayat-pesanan" className="luxury-button primary-button mt-6">
            Kembali ke Riwayat
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Calculate totals
  const subtotal = order.items.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );
  const tax = order.tax || Math.round(subtotal * 0.1);
  const shipping = order.shipping || 20000;
  const total = order.total || (subtotal + tax + shipping);

  return (
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar title="Detail Pesanan" showBack />

      <div className="luxury-container space-y-6">
        {/* Order Header */}
        <section className="glass-card rounded-[26px] border border-[#e3d6c5] bg-white/90 px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[#5c3316]/60 uppercase tracking-[0.3em]">ID Pesanan</p>
              <p className="text-lg font-semibold text-[#5c3316]">{order.id}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="text-sm font-semibold">{order.status}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#eadfd0]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#fdf3ec]">
                <Calendar size={18} className="text-[#7b4d2a]" />
              </div>
              <div>
                <p className="text-xs text-[#5c3316]/60">Tanggal</p>
                <p className="text-sm font-medium text-[#5c3316]">{order.date || "29 Sep 2024"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#fdf3ec]">
                <Clock size={18} className="text-[#7b4d2a]" />
              </div>
              <div>
                <p className="text-xs text-[#5c3316]/60">Waktu</p>
                <p className="text-sm font-medium text-[#5c3316]">{order.time || "14:30 WIB"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="glass-card rounded-[26px] border border-[#e3d6c5] bg-white/90 px-5 py-5">
          <h3 className="text-sm font-semibold text-[#5c3316] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Package size={18} className="text-[#7b4d2a]" />
            Produk Dipesan
          </h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-[#eadfd0] last:border-0 last:pb-0">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[#eadfd0] bg-white/70">
                  <img
                    src={resolveImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/logo_batik.jpg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-[#5c3316]">{item.name}</h4>
                  <p className="text-xs text-[#5c3316]/60 mt-1">
                    Ukuran: {item.size} • Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-[#7b4d2a] mt-2">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="glass-card rounded-[26px] border border-[#e3d6c5] bg-white/90 px-5 py-5">
          <h3 className="text-sm font-semibold text-[#5c3316] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-[#7b4d2a]" />
            Alamat Pengiriman
          </h3>
          <div className="bg-[#fdf3ec] rounded-2xl p-4">
            <p className="font-semibold text-[#5c3316]">
              {order.shippingAddress?.recipient_name || "Nama Penerima"}
            </p>
            <p className="text-sm text-[#5c3316]/70 mt-1">
              {order.shippingAddress?.recipient_phone || "08xxxxxxxxxx"}
            </p>
            <p className="text-sm text-[#5c3316]/70 mt-2">
              {order.shippingAddress?.address || "Alamat lengkap pengiriman"}
            </p>
            <p className="text-xs text-[#5c3316]/60 mt-1">
              {order.shippingAddress?.district || "Kecamatan"}, {order.shippingAddress?.city || "Kota"}, {order.shippingAddress?.province || "Provinsi"} {order.shippingAddress?.postal_code || "00000"}
            </p>
          </div>
        </section>

        {/* Payment Method */}
        <section className="glass-card rounded-[26px] border border-[#e3d6c5] bg-white/90 px-5 py-5">
          <h3 className="text-sm font-semibold text-[#5c3316] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-[#7b4d2a]" />
            Metode Pembayaran
          </h3>
          <div className="bg-[#fdf3ec] rounded-2xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center border border-[#e3d6c5]">
              <CreditCard size={24} className="text-[#7b4d2a]" />
            </div>
            <div>
              <p className="font-semibold text-[#5c3316]">
                {order.paymentMethod || "Transfer Bank"}
              </p>
              <p className="text-sm text-[#5c3316]/70">
                {order.paymentBank || "Bank BCA"}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Summary */}
        <section className="glass-card rounded-[26px] border border-[#e3d6c5] bg-white/90 px-5 py-5">
          <h3 className="text-sm font-semibold text-[#5c3316] uppercase tracking-[0.3em] mb-4">
            Ringkasan Pembayaran
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#5c3316]">
              <span>Subtotal ({order.items.length} produk)</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-[#5c3316]">
              <span>Pajak (10%)</span>
              <span>Rp {tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-[#5c3316]">
              <span>Ongkos Kirim</span>
              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#eadfd0] text-base font-semibold text-[#7b4d2a]">
              <span>Total Pembayaran</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowReceipt(true)}
            className="luxury-button primary-button justify-center"
          >
            <Receipt size={18} />
            Lihat Struk Pembayaran
          </button>
          <Link href="/riwayat-pesanan" className="luxury-button justify-center">
            Kembali ke Riwayat
          </Link>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Receipt Content */}
            <div ref={receiptRef} className="p-6 print:p-4">
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h2 className="text-xl font-bold text-[#5c3316]">BATIK CINDUR BATAM</h2>
                <p className="text-xs text-gray-500 mt-1">Jl. Batik Cindur No. 123, Batam</p>
                <p className="text-xs text-gray-500">Telp: (0778) 123-4567</p>
              </div>

              {/* Receipt Info */}
              <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">No. Transaksi:</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Tanggal:</span>
                  <span>{order.date || "29 Sep 2024"}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Waktu:</span>
                  <span>{order.time || "14:30 WIB"}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Kasir:</span>
                  <span>System</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">DAFTAR BELANJA:</p>
                {order.items.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</span>
                      <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-xs text-gray-500">Ukuran: {item.size}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pajak (10%):</span>
                  <span>Rp {tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ongkir:</span>
                  <span>Rp {shipping.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
                  <span>TOTAL:</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Metode Bayar:</span>
                  <span>{order.paymentMethod || "Transfer Bank"}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Status:</span>
                  <span className={order.status === "Pesanan Selesai" ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                    {order.status === "Pesanan Selesai" ? "LUNAS" : "PENDING"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center border-t border-dashed border-gray-300 pt-4">
                <p className="text-sm font-medium text-[#5c3316]">Terima Kasih</p>
                <p className="text-xs text-gray-500 mt-1">Atas Kunjungan Anda</p>
                <p className="text-xs text-gray-400 mt-2">
                  Simpan struk ini sebagai bukti pembayaran
                </p>
                <div className="mt-4 p-2 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 font-mono">{order.id}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-200 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#7b4d2a] text-white rounded-xl font-semibold hover:bg-[#5c3316] transition"
              >
                <Printer size={18} />
                Cetak
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e3d6c5] text-[#5c3316] rounded-xl font-semibold hover:bg-[#fdf3ec] transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed {
            position: absolute;
            inset: 0;
            background: white !important;
          }
          .fixed > div {
            max-width: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
          }
          .fixed > div > div:first-child,
          .fixed > div > div:first-child * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

