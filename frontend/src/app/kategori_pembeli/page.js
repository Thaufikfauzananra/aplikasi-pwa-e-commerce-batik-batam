"use client";
import { useState, useEffect, useRef } from "react";
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
import { dataProduk } from "@/lib/data/dataProduk";

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
  const filterRef = useRef(null);

  // ❤️ Wishlist toggle
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 🔍 Filter produk
  const filteredProducts = dataProduk.filter((p) => {
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

  // ✨ Tutup filter kalau klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    if (showFilter) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFilter]);

  return (
    <>
      <div className="min-h-screen bg-[#fefaf6] text-[#5a3921] pb-20 relative">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_batik.jpg"
              alt="Batik Cindur"
              width={60}
              height={60}
              className="rounded-full"
            />
            <h1 className="text-xl font-semibold">Batik Cindur Batam</h1>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="absolute right-32 top-1/2 transform -translate-y-1/2 bg-white border border-[#b08968]/50 rounded-full shadow-md px-4 py-1 flex items-center gap-2 w-[250px]">
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
                onClick={() => setShowSearch(false)}
              />
            </div>
          )}

          <div className="flex items-center gap-5">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Search className="w-6 h-6 text-[#704d31]" />
            </button>
            <button onClick={() => router.push("/keranjang")}>
              <ShoppingCart className="w-6 h-6 text-[#704d31]" />
            </button>
            <button onClick={() => router.push("/profil")}>
              <User className="w-6 h-6 text-[#704d31]" />
            </button>
          </div>
        </header>

        {/* Filter */}
        <div className="flex items-center justify-between px-6 mt-4 relative" ref={filterRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilter(!showFilter);
            }}
            className={`flex items-center gap-2 border border-[#b08968] px-5 py-2 rounded-lg text-sm font-medium ${
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
            <div className="absolute top-12 left-0 bg-white shadow-lg rounded-xl border border-[#d6c2aa] w-64 p-4 z-50">
              <p className="text-sm font-semibold text-[#704d31] mb-2">Bahan</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Katun", "Sutra", "Rayon"].map((bahan) => (
                  <button
                    key={bahan}
                    onClick={() => setSelectedBahan(bahan)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedBahan === bahan
                        ? "bg-[#704d31] text-white"
                        : "border-[#b08968] hover:bg-[#fdf3ec]"
                    }`}
                  >
                    {bahan}
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold text-[#704d31] mb-2">Ukuran</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {["S", "M", "L", "XL", "XXL"].map((ukuran) => (
                  <button
                    key={ukuran}
                    onClick={() => setSelectedUkuran(ukuran)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedUkuran === ukuran
                        ? "bg-[#704d31] text-white"
                        : "border-[#b08968] hover:bg-[#fdf3ec]"
                    }`}
                  >
                    {ukuran}
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold text-[#704d31] mb-2">Warna</p>
              <div className="flex flex-wrap gap-2">
                {["Coklat", "Merah", "Biru", "Hijau"].map((warna) => (
                  <button
                    key={warna}
                    onClick={() => setSelectedWarna(warna)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedWarna === warna
                        ? "bg-[#704d31] text-white"
                        : "border-[#b08968] hover:bg-[#fdf3ec]"
                    }`}
                  >
                    {warna}
                  </button>
                ))}
              </div>

              <button
                onClick={resetFilter}
                className="w-full mt-4 border border-[#d6c2aa] py-2 rounded-lg text-sm text-[#704d31] hover:bg-[#fdf3ec]"
              >
                Hapus Filter
              </button>
            </div>
          )}
        </div>

        {/* Produk */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 px-6 mt-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/detail_produk/${p.id}`)}
              className="bg-white rounded-xl border border-[#e7d9c6]/50 shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative w-full h-64">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p.id);
                  }}
                  className="absolute bottom-3 right-3 bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-[#fdf3ec]"
                >
                  <Heart
                    size={18}
                    className={`${
                      wishlist.includes(p.id)
                        ? "fill-[#704d31] text-[#704d31]"
                        : "text-[#704d31]"
                    }`}
                  />
                </button>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium">{p.name}</h3>
                <p className="text-[#704d31] font-semibold text-sm">
                  Rp {p.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
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
