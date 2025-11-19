"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { XCircle } from "lucide-react";

export default function PembayaranGagal() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar showBack />
      <div className="luxury-container flex min-h-[calc(100vh-140px)] flex-col items-center justify-center text-center md:max-w-xl">
        <div className="glass-card mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-[#ffd6d6] bg-[#fff0f0] shadow-[0_30px_80px_-50px_rgba(239,68,68,0.5)]">
          <XCircle size={70} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-semibold text-[#5c3316]">Pembayaran Gagal</h1>
        <p className="mt-3 text-sm text-[#5c3316]/70 md:text-base">
          Kami belum dapat memproses pembayaranmu. Periksa kembali koneksi dan metode pembayaran,
          lalu coba lagi.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={() => router.push("/pembayaran")}
            className="luxury-button primary-button text-base justify-center"
          >
            Coba lagi
          </button>
          <Link href="/keranjang" className="luxury-button text-base justify-center">
            Kembali ke keranjang
          </Link>
        </div>
      </div>
    </div>
  );
}

