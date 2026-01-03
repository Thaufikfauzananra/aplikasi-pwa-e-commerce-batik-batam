"use client";
import Link from "next/link";
import { 
  Shirt, 
  ShirtIcon, 
  ShoppingBag, 
  Package
} from "lucide-react";

const categories = [
  {
    name: "Pakaian Pria",
    icon: Shirt,
    href: "/kategori?type=pria",
    gradient: "from-[#d1b38f] via-[#f5e6d0] to-[#fefaf6]",
  },
  {
    name: "Pakaian Wanita",
    icon: ShirtIcon,
    href: "/kategori?type=wanita",
    gradient: "from-[#f0d6d5] via-[#fbeeee] to-[#fff8f8]",
  },
  {
    name: "Aksesoris",
    icon: ShoppingBag,
    href: "/kategori?type=aksesoris",
    gradient: "from-[#e5d7f5] via-[#f0e6ff] to-[#fdf8ff]",
  },
  {
    name: "Kain",
    icon: Package,
    href: "/kategori?type=kain",
    gradient: "from-[#f3e5c5] via-[#fff2d6] to-[#fffaec]",
  },
];

export default function KategoriList() {
  return (
    <section className="mb-10">
      <div className="section-heading px-2 md:px-0">
        <h3>Kategori Pilihan</h3>
        <span>Temukan gaya terbaik sesuai kebutuhanmu</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 px-2 md:px-0 luxury-scroll">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={category.href}
              className="group relative min-w-[160px] md:min-w-[190px] rounded-3xl border border-[#e3d6c5]/80 bg-white/70 p-5 shadow-[0_14px_40px_-28px_rgba(91,55,23,0.6)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(91,55,23,0.55)]"
            >
              <div
                className={`absolute inset-1 rounded-[26px] bg-gradient-to-br ${category.gradient} opacity-75 transition-opacity group-hover:opacity-90`}
              />
              <div className="relative flex flex-col items-start gap-4">
                <span className="floating-badge bg-white/70 border-white/60 text-[#7b4d2a]/90">
                  Koleksi
                </span>
                <div className="flex items-center justify-between w-full">
                  <div className="space-y-2">
                    <p className="text-sm text-[#5c3316]/70 uppercase tracking-[0.35em]">
                      Eksklusif
                    </p>
                    <h4 className="text-lg font-semibold text-[#5c3316] leading-tight">
                      {category.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/80 border border-white/60 shadow-inner">
                    <Icon size={26} className="text-[#7b4d2a]" />
                  </div>
                </div>
                <span className="text-xs font-medium text-[#5c3316]/60 group-hover:text-[#5c3316] transition">
                  Lihat koleksi
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

