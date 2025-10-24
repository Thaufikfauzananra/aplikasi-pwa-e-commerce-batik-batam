"use client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PembayaranBerhasil() {
  const pesanan = [
    {
      id: 1,
      name: "Batik Cap Motif Daun",
      harga: 200000,
      jumlah: 1,
    },
    {
      id: 2,
      name: "Batik Tulis Motif Bunga",
      harga: 150000,
      jumlah: 1,
    },
  ];

  const totalHarga = pesanan.reduce(
    (acc, item) => acc + item.harga * item.jumlah,
    0
  );

  return (
    <div className="min-h-screen bg-[#fefaf6] text-[#5a3921] flex flex-col items-center justify-center p-6">
      {/* ✅ Icon Sukses */}
      <CheckCircle size={90} className="text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2 text-center">
        Pembayaran Berhasil!
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Terima kasih telah berbelanja di <b>Batik Cindur Batam</b> 🥰
      </p>

      {/* 🧾 Ringkasan Pesanan */}
      <div className="bg-white border border-[#e7d9c6]/70 rounded-xl shadow-sm w-full max-w-md p-5 mb-8">
        <h2 className="font-semibold text-[#704d31] mb-3 text-center">
          Ringkasan Pesanan
        </h2>
        <div className="divide-y divide-[#f3e9dc]">
          {pesanan.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>{item.name}</span>
              <span>
                Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 font-semibold text-[#704d31]">
          <span>Total Pembayaran</span>
          <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* 🏠 Tombol Aksi */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <Link
          href="/BerandaPembeli"
          className="bg-[#704d31] text-white text-center py-3 rounded-lg font-medium hover:bg-[#5a3921] transition"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/kategori_pembeli"
          className="border border-[#704d31] text-[#704d31] text-center py-3 rounded-lg font-medium hover:bg-[#fdf3ec] transition"
        >
          Lihat Produk Lain
        </Link>
      </div>

      {/* 🧾 Info Transaksi */}
      <p className="text-xs text-gray-500 mt-8 text-center">
        Nomor Pesanan: <b>#CINDUR2025-001</b>
        <br />
        Pembayaran telah diterima pada <b>18 Oktober 2025</b>
      </p>
    </div>
  );
}
