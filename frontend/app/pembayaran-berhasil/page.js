"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { CheckCircle } from "lucide-react";

export default function PembayaranBerhasil() {
  const router = useRouter();
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) {
      setPesanan(JSON.parse(data));
    }
  }, []);

  const totalHarga = pesanan.reduce(
    (acc, item) => acc + Number(item.harga || item.price || 0) * Number(item.jumlah || 1),
    0
  );

  return (
    <div className="min-h-screen bg-[#fefaf6] flex flex-col items-center justify-center px-4 py-8">
      <Navbar showBack={true} />
      
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle size={100} className="text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#5a3921] mb-3 text-center">
          Pembayaran Berhasil!
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-8 text-center">
          Terima kasih telah berbelanja! Pesanan Anda sedang kami proses.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/riwayat-pesanan"
            className="bg-[#704d31] hover:bg-[#5a3921] text-white text-center py-3 md:py-4 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
          >
            Lihat Detail Pesanan
          </Link>
          <Link
            href="/Beranda"
            className="border-2 border-[#704d31] text-[#704d31] text-center py-3 md:py-4 rounded-lg font-semibold hover:bg-[#fdf3ec] transition"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {/* Order Summary */}
        {pesanan.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mt-6 w-full">
            <h3 className="font-semibold text-[#704d31] mb-3 text-center">
              Ringkasan Pesanan
            </h3>
            <div className="divide-y divide-[#e7d9c6] mb-3">
              {pesanan.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 text-sm"
                >
                  <span className="text-[#5a3921]">{item.name}</span>
                  <span className="text-[#704d31] font-medium">
                    Rp {((item.harga || item.price || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-[#e7d9c6] font-bold text-[#704d31]">
              <span>Total</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
