"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { CheckCircle } from "lucide-react";

export default function PembayaranBerhasil() {
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("lastOrder");
    if (data) {
      setPesanan(JSON.parse(data));
      sessionStorage.removeItem("lastOrder");
    }
  }, []);

  const totalHarga = pesanan.reduce(
    (acc, item) => acc + Number(item.harga || item.price || 0) * Number(item.jumlah || 1),
    0
  );

  return (
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar showBack />
      <div className="luxury-container flex min-h-[calc(100vh-140px)] flex-col items-center justify-center text-center md:max-w-xl">
        <div className="glass-card mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-[#d1f2d2] bg-[#f2fcf2] shadow-[0_30px_80px_-50px_rgba(34,197,94,0.6)]">
          <CheckCircle size={70} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-semibold text-[#5c3316]">Pembayaran Berhasil</h1>
        <p className="mt-3 text-sm text-[#5c3316]/70 md:text-base">
          Terima kasih telah berbelanja. Kami sedang menyiapkan pesananmu dengan penuh perhatian.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link href="/riwayat-pesanan" className="luxury-button primary-button text-base justify-center">
            Lihat detail pesanan
          </Link>
          <Link href="/Beranda" className="luxury-button text-base justify-center">
            Kembali ke beranda
          </Link>
        </div>

        {pesanan.length > 0 && (
          <div className="glass-card mt-8 w-full rounded-[26px] border border-[#e3d6c5] bg-white/90 px-5 py-5">
            <h3 className="mb-3 text-sm font-semibold text-[#5c3316] uppercase tracking-[0.3em]">
              Ringkasan pesanan
            </h3>
            <div className="space-y-2 text-sm text-[#5c3316]">
              {pesanan.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-semibold text-[#7b4d2a]">
                    Rp {((item.harga || item.price || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-[#eadfd0] pt-3 text-sm font-semibold text-[#7b4d2a]">
              <span>Total</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
