"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Filter,
  Home,
  Folder,
  User,
  Search,
  ShoppingCart,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function KategoriPage() {
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [selectedBahan, setSelectedBahan] = useState("");
  const [selectedUkuran, setSelectedUkuran] = useState("");
  const [selectedWarna, setSelectedWarna] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const products = [
    {
      id: 1,
      name: "Blus Katun Coklat",
      price: 249000,
      image: "/wanita1.jpg",
      bahan: "Katun",
      ukuran: ["S", "M", "L"],
      warna: "Coklat",
    },
    {
      id: 2,
      name: "Blus Sutra Merah",
      price: 259000,
      image: "/wanita2.jpg",
      bahan: "Sutra",
      ukuran: ["M", "L", "XL"],
      warna: "Merah",
    },
    {
      id: 3,
      name: "Blus Rayon Biru",
      price: 239000,
      image: "/wanita3.jpg",
      bahan: "Rayon",
      ukuran: ["L", "XL", "XXL"],
      warna: "Biru",
    },
    {
      id: 4,
      name: "Blus Katun Hijau",
      price: 249000,
      image: "/wanita4.jpg",
      bahan: "Katun",
      ukuran: ["M", "L"],
      warna: "Hijau",
    },
  ];

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBahan = selectedBahan ? p.bahan === selectedBahan : true;
    const matchUkuran = selectedUkuran ? p.ukuran.includes(selectedUkuran) : true;
    const matchWarna = selectedWarna ? p.warna === selectedWarna : true;
    return matchSearch && matchBahan && matchUkuran && matchWarna;
  });

  const resetFilter = () => {
    setSelectedBahan("");
    setSelectedUkuran("");
    setSelectedWarna("");
  };

  return (
    <>
      <div className="min-h-screen bg-[#fefaf6] text-[#5a3921] pb-20 relative">
        {/* 🔝 Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative">
          {/* 🔸 Logo + Judul */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo_batik.jpg"
              alt="Batik Cindur"
              width={60}
              height={60}
              className="rounded-full"
            />
            <h1 className="text-xl font-semibold text-[#5a3921]">
              Batik Cindur Batam
            </h1>
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

          {/* 🧭 Ikon kanan */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hover:scale-110 transition-transform"
            >
              <Search className="w-6 h-6 text-[#5a3921] hover:text-[#704d31]" />
            </button>

            <button
              onClick={() => router.push("/keranjang")}
              className="hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-6 h-6 text-[#5a3921] hover:text-[#704d31]" />
            </button>

            <button
              onClick={() => router.push("/profil")}
              className="hover:scale-110 transition-transform"
            >
              <User className="w-6 h-6 text-[#5a3921] hover:text-[#704d31]" />
            </button>
          </div>
        </header>

        {/* 🎚️ FILTER BUTTON */}
        <div className="flex items-center justify-between px-6 mt-4 relative">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 border border-[#b08968] px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                showFilter
                  ? "bg-[#704d31] text-white"
                  : "bg-white text-[#5a3921] hover:bg-[#fdf3ec]"
              }`}
            >
              <Filter size={16} />
              Filter
              <ChevronDown size={16} />
            </button>

            {showFilter && (
              <div className="absolute top-12 left-0 bg-white shadow-lg rounded-xl border border-[#d6c2aa] w-64 p-4 z-50 animate-fadeIn space-y-3">
                {/* Filter Bahan */}
                <div>
                  <p className="text-sm font-semibold text-[#704d31] mb-2">
                    Bahan
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Katun", "Sutra", "Rayon"].map((bahan) => (
                      <button
                        key={bahan}
                        onClick={() => setSelectedBahan(bahan)}
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          selectedBahan === bahan
                            ? "bg-[#704d31] text-white border-[#704d31]"
                            : "border-[#b08968] text-[#5a3921] hover:bg-[#fdf3ec]"
                        }`}
                      >
                        {bahan}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Ukuran */}
                <div>
                  <p className="text-sm font-semibold text-[#704d31] mb-2">
                    Ukuran
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((ukuran) => (
                      <button
                        key={ukuran}
                        onClick={() => setSelectedUkuran(ukuran)}
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          selectedUkuran === ukuran
                            ? "bg-[#704d31] text-white border-[#704d31]"
                            : "border-[#b08968] text-[#5a3921] hover:bg-[#fdf3ec]"
                        }`}
                      >
                        {ukuran}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Warna */}
                <div>
                  <p className="text-sm font-semibold text-[#704d31] mb-2">
                    Warna
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Coklat", "Hitam", "Merah", "Biru", "Hijau"].map((warna) => (
                      <button
                        key={warna}
                        onClick={() => setSelectedWarna(warna)}
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          selectedWarna === warna
                            ? "bg-[#704d31] text-white border-[#704d31]"
                            : "border-[#b08968] text-[#5a3921] hover:bg-[#fdf3ec]"
                        }`}
                      >
                        {warna}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilter}
                  className="w-full mt-3 text-sm text-center py-2 border border-[#d6c2aa] rounded-lg hover:bg-[#fdf3ec] text-[#704d31]"
                >
                  Hapus Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🛍️ Produk Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 px-6 mt-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-[#e7d9c6]/50 overflow-hidden transition-all"
              >
                <div className="relative w-full h-64">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute bottom-3 right-3 bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-[#fdf3ec] transition"
                  >
                    <Heart
                      size={18}
                      className={`${
                        wishlist.includes(p.id)
                          ? "fill-[#704d31] text-[#704d31]"
                          : "text-[#704d31]"
                      } transition-colors`}
                    />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-[#5a3921] truncate">
                    {p.name}
                  </h3>
                  <p className="text-[#704d31] font-semibold text-sm mt-1">
                    Rp {p.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10 col-span-full">
              Tidak ada produk sesuai filter.
            </p>
          )}
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
                size={22}
                className={`${
                  isActive ? "text-[#704d31]" : "text-[#b08968]"
                } transition-colors duration-200`}
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
