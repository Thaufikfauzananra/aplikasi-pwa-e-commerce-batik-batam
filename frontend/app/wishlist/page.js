"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Heart,
  Home,
  Folder,
  ShoppingCart,
  User,
} from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // 🔁 Ambil dari localStorage pas pertama kali dan listen untuk update
  useEffect(() => {
    const loadWishlist = () => {
      const saved = JSON.parse(localStorage.getItem("wishlistData")) || [];
      setWishlist(saved);
    };

    // Load pertama kali
    loadWishlist();

    // Listen untuk perubahan wishlist dari komponen lain
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('storage', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', handleWishlistUpdate);
    };
  }, []);

  // 🗑️ Hapus produk dari wishlist
  const handleRemove = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlistData", JSON.stringify(updated));
    // Trigger event untuk update komponen lain
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // 🧩 Pilih / batal pilih produk
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 🛒 Tambahkan produk terpilih ke keranjang
  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      alert("Pilih produk dulu sebelum menambah ke keranjang 🛍️");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cartData")) || [];
    const selectedProducts = wishlist.filter((item) =>
      selectedItems.includes(item.id)
    );

    const updatedCart = [...existingCart];
    selectedProducts.forEach((product) => {
      const alreadyInCart = updatedCart.find((p) => p.id === product.id);
      if (!alreadyInCart) updatedCart.push(product);
    });

    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    alert("Produk terpilih berhasil ditambahkan ke keranjang 🛒");
    router.push("/keranjang");
  };

  // 💳 Checkout langsung produk terpilih
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Pilih produk dulu sebelum checkout 💳");
      return;
    }

    const selectedProducts = wishlist.filter((item) =>
      selectedItems.includes(item.id)
    );

    localStorage.setItem("checkoutData", JSON.stringify(selectedProducts));
    alert("Menuju halaman checkout...");
    router.push("/pembayaran");
  };

  return (
    <div className="min-h-screen bg-white text-[#5a3921] pb-36 relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
          </button>
          <h1 className="text-lg font-semibold text-[#5a3921]">Wishlist</h1>
        </div>
      </header>

      {/* Daftar Wishlist */}
      <div className="px-6 mt-4 space-y-4">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#fefaf6] border border-[#e7d9c6]/70 rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="w-4 h-4 accent-[#704d31] cursor-pointer"
                />
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
                    Size: {item.size || "-"}, Stock: {item.stock || "-"}
                  </p>
                  <p className="text-[#704d31] font-semibold text-sm mt-1">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Wishlist kamu masih kosong 💔
          </p>
        )}
      </div>

      {/* Tombol Aksi Bawah */}
      {wishlist.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 px-6 py-3 bg-[#fefaf6] border-t border-[#d6c2aa] flex justify-between items-center">
          <button
            onClick={handleAddToCart}
            className="bg-[#704d31] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#5a3921] transition"
          >
            Tambah ke Keranjang
          </button>
          <button
            onClick={handleCheckout}
            className="border border-[#704d31] text-[#704d31] px-5 py-2 rounded-lg text-sm hover:bg-[#fdf3ec] transition"
          >
            Checkout
          </button>
        </div>
      )}

      {/* 🧭 Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fefaf6] border-t border-[#d6c2aa] shadow-sm flex justify-around py-2 z-50">
        {[
          { name: "Beranda", icon: Home, href: "/Beranda" },
          { name: "Kategori", icon: Folder, href: "/kategori" },
          { name: "Wishlist", icon: Heart, href: "/wishlist" },
          { name: "Keranjang", icon: ShoppingCart, href: "/keranjang" },
          { name: "Profil", icon: User, href: "/profil" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center text-center text-xs font-medium ${
                isActive ? "text-[#704d31]" : "text-[#b08968]"
              }`}
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
