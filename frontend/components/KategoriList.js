"use client";
import Link from "next/link";
import { 
  Shirt, 
  ShirtIcon, 
  ShoppingBag, 
  Package
} from "lucide-react";

const categories = [
  { name: "Pakaian Pria", icon: Shirt, href: "/kategori?type=pria", color: "bg-blue-100 text-blue-600" },
  { name: "Pakaian Wanita", icon: ShirtIcon, href: "/kategori?type=wanita", color: "bg-pink-100 text-pink-600" },
  { name: "Aksesoris", icon: ShoppingBag, href: "/kategori?type=aksesoris", color: "bg-purple-100 text-purple-600" },
  { name: "Kain", icon: Package, href: "/kategori?type=kain", color: "bg-amber-100 text-amber-600" },
];

export default function KategoriList() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#5a3921] mb-4 px-2 md:px-0">
        Kategori
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 px-2 md:px-0 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] group"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                <Icon size={28} className="md:w-8 md:h-8" />
              </div>
              <span className="text-xs md:text-sm text-center text-[#5a3921] font-medium">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

