"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Folder,
  Heart,
  ShoppingCart,
  User,
  Trash2,
} from "lucide-react";

export default function KeranjangPage() {
  const pathname = usePathname();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // ✅ Ambil data dari localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    setCart(savedCart);
  }, []);

  // ✅ Update jumlah produk
  const updateJumlah = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let jumlahBaru =
            type === "tambah"
              ? (item.jumlah || 1) + 1
              : item.jumlah > 1
              ? item.jumlah - 1
              : 1;

          if (jumlahBaru > 99) jumlahBaru = 99;
          return { ...item, jumlah: jumlahBaru };
        }
        return item;
      })
    );
  };

  // ✅ Pilih produk untuk checkout
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  // ✅ Hapus produk
  const handleHapus = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  // ✅ Hitung total harga
  const totalHarga = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce(
      (acc, item) => acc + Number(item.harga || item.price || 0) * (item.jumlah || 1),
      0
    );

  // ✅ Checkout
  const handleCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedProducts.length === 0) {
      alert("Pilih produk dulu untuk checkout 🛍️");
      return;
    }
    localStorage.setItem("checkoutData", JSON.stringify(selectedProducts));
    window.location.href = "/pembayaran";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf9] text-[#5a3921]">
      {/* 🔝 Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-[#e7d9c6] bg-white sticky top-0 z-50">
        <Link href="/BerandaPembeli">
          <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
        </Link>
        <h1 className="text-lg font-semibold">Keranjang</h1>
      </header>

      {/* 📦 Daftar Produk */}
      <div className="flex-1 overflow-y-auto px-6 mt-4 pb-36 space-y-4">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#fefaf6] border border-[#e7d9c6]/70 rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >
              {/* Produk */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="mt-2 w-4 h-4 accent-[#704d31]"
                />
                <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Ukuran: {item.ukuran || item.size} | Stok:{" "}
                    {item.stok || item.stock}
                  </p>
                  <p className="text-[#704d31] font-semibold text-sm mt-1">
                    Rp{" "}
                    {(item.harga || item.price || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Tombol jumlah & hapus */}
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateJumlah(item.id, "kurang")}
                    className="w-6 h-6 flex items-center justify-center border border-[#b08968] rounded-full hover:bg-[#fdf3ec]"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-6 text-center">
                    {item.jumlah || 1}
                  </span>
                  <button
                    onClick={() => updateJumlah(item.id, "tambah")}
                    className="w-6 h-6 flex items-center justify-center border border-[#b08968] rounded-full hover:bg-[#fdf3ec]"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleHapus(item.id)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-2"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Keranjang kamu masih kosong 🛒
          </p>
        )}
      </div>

      {/* 💰 Checkout bar tetap di bawah */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#d6c2aa] px-6 py-4 shadow-lg">
          <div className="flex justify-between items-center text-sm mb-3">
            <span>Total ({selectedItems.length} produk dipilih)</span>
            <span className="font-semibold text-[#704d31]">
              Rp {totalHarga.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className={`w-full py-3 rounded-lg font-medium transition ${
              selectedItems.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#704d31] text-white hover:bg-[#5a3921]"
            }`}
          >
            {selectedItems.length === 0
              ? "Pilih Produk Dulu"
              : "Lanjutkan ke Pembayaran"}
          </button>
        </div>
      )}
    </div>
  );
}
