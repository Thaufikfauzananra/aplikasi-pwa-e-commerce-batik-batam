"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Home, Folder, Heart, ShoppingCart, User } from "lucide-react";

export default function KeranjangPage() {
  const pathname = usePathname();
  const [cart, setCart] = useState([
    { id: 1, name: "Batik Cindur Batam - Motif Daun", stok: 10, ukuran: "M", harga: 300000, jumlah: 1, image: "/wanita1.jpg" },
    { id: 2, name: "Batik Cindur Batam - Motif Bunga", stok: 5, ukuran: "L", harga: 300000, jumlah: 2, image: "/wanita2.jpg" },
  ]);

  const updateJumlah = (id, type) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              jumlah:
                type === "tambah"
                  ? item.jumlah + 1
                  : item.jumlah > 1
                  ? item.jumlah - 1
                  : 1,
            }
          : item
      )
    );
  };

  const totalHarga = cart.reduce((acc, item) => acc + item.harga * item.jumlah, 0);

  const handleCheckout = () => {
    localStorage.setItem("checkoutData", JSON.stringify(cart));
    window.location.href = "/pembayaran";
  };

  return (
    <>
      <div className="min-h-screen bg-white text-[#5a3921] pb-28">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/BerandaPembeli">
              <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
            </Link>
            <h1 className="text-lg font-semibold text-[#5a3921]">Keranjang</h1>
          </div>
        </header>

        <div className="px-6 mt-4 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-[#fefaf6] border border-[#e7d9c6]/70 rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600">Stok: {item.stok}</p>
                  <p className="text-xs text-gray-600">
                    Ukuran: {item.ukuran}, Harga: Rp {item.harga.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateJumlah(item.id, "kurang")} className="w-6 h-6 flex items-center justify-center border border-[#b08968] rounded-full hover:bg-[#fdf3ec]">-</button>
                <span className="text-sm font-medium">{item.jumlah}</span>
                <button onClick={() => updateJumlah(item.id, "tambah")} className="w-6 h-6 flex items-center justify-center border border-[#b08968] rounded-full hover:bg-[#fdf3ec]">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-[#d6c2aa] px-6 py-4">
          <div className="flex justify-between items-center text-sm mb-3">
            <span>Total:</span>
            <span className="font-semibold text-[#704d31]">Rp {totalHarga.toLocaleString("id-ID")}</span>
          </div>
          <button onClick={handleCheckout} className="w-full bg-[#704d31] text-white py-3 rounded-lg font-medium hover:bg-[#5a3921] transition">
            Lanjutkan ke Pembayaran
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fefaf6] border-t border-[#d6c2aa] shadow-sm flex justify-around py-2 z-50">
        {[{ name: "Beranda", icon: Home, href: "/BerandaPembeli" }, { name: "Kategori", icon: Folder, href: "/kategori_pembeli" }, { name: "Wishlist", icon: Heart, href: "/wishlist" }, { name: "Keranjang", icon: ShoppingCart, href: "/keranjang" }, { name: "Profil", icon: User, href: "/profil" }].map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center text-center text-xs font-medium ${isActive ? "text-[#704d31]" : "text-[#b08968]"}`}>
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
