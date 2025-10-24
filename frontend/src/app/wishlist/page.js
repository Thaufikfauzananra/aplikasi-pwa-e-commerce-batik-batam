"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Trash2, Heart, Home, Folder, ShoppingCart, User } from "lucide-react";

export default function WishlistPage() {
  const pathname = usePathname();

  // 🔖 Data Wishlist (contoh, bisa diganti dari API)
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Batik Cindur Batam - Motif Daun",
      size: "M",
      stock: 10,
      price: 250000,
      image: "/pria1.jpg",
    },
    {
      id: 2,
      name: "Batik Cindur Batam - Motif Bunga",
      size: "L",
      stock: 5,
      price: 300000,
      image: "/wanita2.jpg",
    },
    {
      id: 3,
      name: "Batik Cindur Batam - Motif Abstrak",
      size: "S",
      stock: 20,
      price: 200000,
      image: "/pria3.jpg",
    },
  ]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = () => {
    alert("Produk ditambahkan ke keranjang 🛒");
  };

  const handleCheckout = () => {
    alert("Lanjut ke halaman Checkout 💳");
  };

  return (
    <>
      <div className="min-h-screen bg-white text-[#5a3921] pb-28 relative">
        {/* 🔝 Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/BerandaPembeli">
              <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
            </Link>
            <h1 className="text-lg font-semibold text-[#5a3921]">Wishlist</h1>
          </div>
        </header>

        {/* ❤️ Daftar Wishlist */}
        <div className="px-6 mt-4 space-y-4">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#fefaf6] border border-[#e7d9c6]/70 rounded-xl p-3 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      Size: {item.size}, Stock: {item.stock}
                    </p>
                    <p className="text-[#704d31] font-semibold text-sm mt-1">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Wishlist kamu masih kosong 💔
            </p>
          )}
        </div>

        {/* 🛒 Tombol bawah */}
        {wishlist.length > 0 && (
          <div className="fixed bottom-14 left-0 right-0 flex justify-center gap-4 px-6 py-4 bg-white border-t border-[#d6c2aa]">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#704d31] text-white py-3 rounded-lg font-medium hover:bg-[#5a3921] transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-[#f8f4f0] text-[#704d31] border border-[#d6c2aa] py-3 rounded-lg font-medium hover:bg-[#fdf3ec] transition"
            >
              Checkout
            </button>
          </div>
        )}
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
