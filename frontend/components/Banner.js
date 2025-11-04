"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Banner() {
  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden mb-6 shadow-md">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#704d31] to-[#b08968]">
        <Image
          src="/barelang.jpg"
          alt="Banner Batik Batam"
          fill
          className="object-cover opacity-80"
        />
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-3 drop-shadow-lg">
          KOLEKSI TERBARU MOTIF GONGGONG
        </h2>
        <Link
          href="/kategori"
          className="inline-flex items-center gap-2 bg-white text-[#704d31] px-6 py-2 rounded-full font-semibold hover:bg-[#fefaf6] transition shadow-lg"
        >
          <span>LIHAT SEKARANG</span>
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}

