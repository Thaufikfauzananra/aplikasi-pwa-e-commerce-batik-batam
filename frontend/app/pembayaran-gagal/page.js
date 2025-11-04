"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { XCircle } from "lucide-react";

export default function PembayaranGagal() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fefaf6] flex flex-col items-center justify-center px-4 py-8">
      <Navbar showBack={true} />
      
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle size={80} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#5a3921] mb-3 text-center">
          Pembayaran Gagal
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-8 text-center">
          Silakan periksa koneksi atau metode pembayaran Anda.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => router.push("/pembayaran")}
            className="bg-[#704d31] hover:bg-[#5a3921] text-white text-center py-3 md:py-4 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
          >
            Coba Lagi
          </button>
          <Link
            href="/keranjang"
            className="border-2 border-[#704d31] text-[#704d31] text-center py-3 md:py-4 rounded-lg font-semibold hover:bg-[#fdf3ec] transition"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  );
}

