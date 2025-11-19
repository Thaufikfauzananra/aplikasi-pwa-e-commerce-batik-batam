"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#e3d6c5] bg-gradient-to-br from-[#7b4d2a] via-[#8f5c33] to-[#d2a87a] py-10 md:py-16 mb-8 shadow-[0_30px_80px_-40px_rgba(82,46,16,0.7)]">
      <div className="absolute inset-0">
        <Image
          src="/barelang.jpg"
          alt="Banner Batik Batam"
          fill
          className="object-cover opacity-35 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),rgba(123,77,42,0.4))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 px-6 md:px-12">
        <div className="max-w-xl text-center lg:text-left">
          <span className="floating-badge bg-white/30 border-white/40 text-white/90">
            Koleksi eksklusif
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight drop-shadow-lg">
            Motif Gonggong Khas Kepulauan Riau
          </h2>
          <p className="mt-4 text-white/90 text-sm md:text-base leading-relaxed">
            Sentuhan klasik dalam anyaman modern. Temukan batik terbaik dengan sentuhan warna hangat, kain premium, dan detail khas yang memancarkan kemewahan.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/kategori"
              className="luxury-button primary-button text-sm sm:text-base"
            >
              Jelajahi Koleksi
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/cari"
              className="luxury-button text-sm sm:text-base"
            >
              Lihat katalog lengkap
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <div className="absolute inset-0 bg-white/15 blur-3xl rounded-full" />
          <div className="relative overflow-hidden rounded-[26px] border border-white/40 bg-white/20 backdrop-blur-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)] p-5">
            <Image
              src="/wanita4.jpg"
              alt="Koleksi Batik Premium"
              width={420}
              height={520}
              className="w-full h-auto rounded-2xl object-cover shadow-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/70">
              <p className="text-xs uppercase tracking-[0.35em] text-[#c08a3e] font-semibold">
                Capsule Collection
              </p>
              <p className="text-base font-semibold text-[#5c3316]">
                Batik Gonggong 2025
              </p>
              <span className="text-xs text-[#5c3316]/70">Limited edition · 150 pcs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

