"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Search,
  User,
  X,
  Heart,
  Home,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BerandaPembeli() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Batik Gonggong Elegan",
      price: 250000,
      category: "Pakaian Wanita",
      image: "/wanita1.jpg",
    },
    {
      id: 2,
      name: "Batik Leluhur Hitam",
      price: 320000,
      category: "Pakaian Pria",
      image: "/pria2.jpg",
    },
    {
      id: 3,
      name: "Batik Cindur Pink Blossom",
      price: 280000,
      category: "Pakaian Wanita",
      image: "/wanita3.jpg",
    },
    {
      id: 4,
      name: "Batik Gonggong Batam",
      price: 150000,
      category: "Pakaian Pria",
      image: "/pria3.jpg",
    },
    {
      id: 5,
      name: "Tas Batik Kalung Cindur",
      price: 150000,
      category: "Aksesori",
      image: "/tas.jpg",
    },
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category &&
        p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#fefaf6] text-[#5a3921] flex flex-col pb-20">
        {/* 🔝 Navbar */}
        <header className="flex justify-between items-center px-10 py-5 bg-white shadow-md relative">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_batik.jpg"
              alt="Batik Cindur"
              width={100}
              height={100}
              className="rounded-full"
            />
            <h1 className="text-2xl font-semibold">Batik Cindur Batam</h1>
          </div>

          {/* 🔍 Search bar */}
          {showSearch && (
            <div className="absolute right-32 top-1/2 transform -translate-y-1/2 bg-white border border-[#b08968]/50 rounded-full shadow-md px-4 py-1 flex items-center gap-2 w-[250px] transition-all duration-300">
              <Search className="w-4 h-4 text-[#b08968]" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none flex-1 text-sm bg-transparent text-[#5a3921]"
              />
              <X
                className="w-4 h-4 cursor-pointer hover:text-red-500"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
              />
            </div>
          )}

          {/* 🔘 Ikon kanan (sudah terhubung) */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hover:scale-110 transition-transform"
            >
              <Search className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
            </button>

            <button
              onClick={() => router.push("/keranjang")}
              className="hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
            </button>

            <button
              onClick={() => router.push("/profil")}
              className="hover:scale-110 transition-transform"
            >
              <User className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
            </button>
          </div>
        </header>

        {/* 🖼️ Banner */}
        <section className="relative w-full h-[400px] mt-5 rounded-xl overflow-hidden mx-auto max-w-6xl shadow-lg">
          <Image
            src="/barelang.jpg"
            alt="Koleksi Batik Cindur"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10 text-white">
            <h2 className="text-4xl font-semibold mb-3">
              Koleksi Terbaru Motif Gonggong
            </h2>
            <button className="bg-[#b08968] px-6 py-3 w-fit rounded-full font-medium hover:bg-[#a07658] transition">
              Lihat Sekarang
            </button>
          </div>
        </section>

        {/* 🧵 Kategori */}
        <section className="w-full flex justify-center mt-10">
          <div className="w-full max-w-6xl px-4">
            <h3 className="text-xl font-semibold mb-5">Kategori</h3>
            <div className="flex flex-wrap gap-4">
              {["Kain", "Pakaian Pria", "Pakaian Wanita", "Aksesori"].map(
                (kategori) => (
                  <div
                    key={kategori}
                    className="border-2 border-[#b08968] text-[#5a3921] px-6 py-3 rounded-full cursor-pointer hover:bg-[#b08968]/10 transition"
                    onClick={() => setSearchQuery(kategori)}
                  >
                    {kategori}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* 🛍️ Produk Terbaru */}
        <section className="w-full flex justify-center mt-12 flex-1">
          <div className="w-full max-w-6xl px-4">
            <h3 className="text-xl font-semibold mb-6">Produk Terbaru</h3>

            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 mt-10 text-center">
                Produk tidak ditemukan...
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-start">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#b08968]/30 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden w-full max-w-[270px]"
                  >
                    {/* 📸 Gambar Produk */}
                    <div className="w-full h-64 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* 🏷️ Info Produk + Wishlist */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-[#5a3921] font-medium text-base mb-1 truncate">
                          {p.name}
                        </h3>
                        <p className="text-[#704d31] font-semibold text-sm">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 rounded-full border border-[#b08968]/50 hover:bg-[#fdf3ec] transition-all"
                      >
                        <Heart
                          size={18}
                          className={`transition-colors duration-300 ${
                            wishlist.includes(p.id)
                              ? "fill-[#704d31] text-[#704d31]"
                              : "text-[#704d31]"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 🧭 Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fefaf6] border-t border-[#d6c2aa] shadow-sm flex justify-around py-2 z-50">
        {[
          { name: "Beranda", icon: Home, href: "/BerandaPembeli" },
          { name: "Kategori", icon: Folder, href: "/kategori_pembeli" },
          { name: "Wishlist", icon: Heart, href: "/wishlist" },
          { name: "Keranjang", icon: ShoppingCart, href: "/keranjang" },
          { name: "Profil", icon: User, href: "/profil" },
        ].map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center text-center text-xs font-medium transition-transform ${
                isActive
                  ? "scale-110 text-[#704d31]"
                  : "text-[#b08968] hover:scale-105"
              }`}
            >
              <Icon
                size={24}
                className={`transition-colors duration-200 ${
                  isActive ? "text-[#704d31]" : "text-[#b08968]"
                }`}
              />
              <span
                className={`mt-1 ${
                  isActive ? "text-[#704d31]" : "text-[#b08968]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
