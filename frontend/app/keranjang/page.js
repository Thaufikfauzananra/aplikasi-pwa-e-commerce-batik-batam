"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import {
  Trash2,
  Bookmark,
  Edit2,
  ChevronRight,
  ShoppingCart,
  X,
} from "lucide-react";

export default function KeranjangPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    setCart(savedCart);

    // Select all items by default
    setSelectedItems(savedCart.map((item) => item.id));

    // Load saved payment method
    const savedPayment = localStorage.getItem("paymentMethod");
    if (savedPayment) {
      setPaymentMethod(savedPayment);
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cartData", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }
  }, [cart]);

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

  const updateUkuran = (id, newSize) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ukuran: newSize, size: newSize };
        }
        return item;
      })
    );
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleHapus = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const totalHarga = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce(
      (acc, item) =>
        acc + Number(item.harga || item.price || 0) * (item.jumlah || 1),
      0
    );

  const handleCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedProducts.length === 0) {
      alert("Pilih produk dulu untuk checkout");
      return;
    }
    localStorage.setItem("checkoutData", JSON.stringify(selectedProducts));
    localStorage.setItem("paymentMethod", paymentMethod);
    router.push("/checkout");
  };

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
        <Navbar title="Keranjang Belanja" showBack={true} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="relative mb-6">
            <ShoppingCart size={120} className="text-gray-300" />
            <X
              size={60}
              className="text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h2 className="text-xl font-semibold text-[#5a3921] mb-2 text-center">
            Keranjang Anda kosong.
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Silakan tambahkan produk terlebih dahulu.
          </p>
          <Link
            href="/Beranda"
            className="bg-[#704d31] hover:bg-[#5a3921] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Mulai Belanja
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Default shipping address
  const shippingAddress = {
    label: "Rumah",
    address: "Jl. Diponegoro No. 10, Batam",
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-32 md:pb-6">
      <Navbar title="Keranjang Belanja" showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.ukuran || item.size || ""}`}
              className="bg-white rounded-xl border border-[#e7d9c6] p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/logo_batik.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#5a3921] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-[#704d31]">
                        Rp{" "}
                        {(item.harga || item.price || 0).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      {/* Size selector */}
                      <div className="mt-2 flex items-center gap-3">
                        <label className="text-sm text-gray-600">Ukuran</label>
                        <select
                          value={
                            Array.isArray(item.ukuran || item.size)
                              ? (item.ukuran || item.size)[0]
                              : item.ukuran || item.size || ""
                          }
                          onChange={(e) =>
                            updateUkuran(item.id, e.target.value)
                          }
                          className="border border-[#e7d9c6] rounded-lg px-3 py-1 text-sm bg-white"
                        >
                          {(Array.isArray(item.sizes)
                            ? item.sizes
                            : item.sizes
                            ? String(item.sizes).split(",")
                            : Array.isArray(item.availableSizes)
                            ? item.availableSizes
                            : item.availableSizes
                            ? String(item.availableSizes).split(",")
                            : ["S", "M", "L", "XL"]
                          ).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleHapus(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 border border-[#b08968] rounded-lg">
                      <button
                        onClick={() => updateJumlah(item.id, "kurang")}
                        className="px-3 py-1 text-[#704d31] hover:bg-[#fdf3ec] transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-medium text-[#5a3921]">
                        {item.jumlah || 1}
                      </span>
                      <button
                        onClick={() => updateJumlah(item.id, "tambah")}
                        className="px-3 py-1 text-[#704d31] hover:bg-[#fdf3ec] transition"
                      >
                        +
                      </button>
                    </div>
                    <button className="text-[#704d31] hover:text-[#5a3921] p-2">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-[#5a3921]">Alamat Pengiriman</h3>
            <button className="text-[#704d31] hover:text-[#5a3921] flex items-center gap-1">
              <Edit2 size={16} />
              <span className="text-sm">Ubah</span>
            </button>
          </div>
          <div>
            <p className="font-medium text-[#5a3921] mb-1">
              {shippingAddress.label}
            </p>
            <p className="text-sm text-gray-600">{shippingAddress.address}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 mb-4">
          <h3 className="font-semibold text-[#5a3921] mb-3">
            Metode Pembayaran
          </h3>
          <div className="space-y-3">
            <label
              className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition hover:bg-[#fdf3ec]"
              style={{
                borderColor:
                  paymentMethod === "transfer" ? "#704d31" : "#e7d9c6",
              }}
            >
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#704d31]"
              />
              <span className="font-medium text-[#5a3921]">Transfer Bank</span>
            </label>
            <label
              className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition hover:bg-[#fdf3ec]"
              style={{
                borderColor:
                  paymentMethod === "digital" ? "#704d31" : "#e7d9c6",
              }}
            >
              <input
                type="radio"
                name="payment"
                value="digital"
                checked={paymentMethod === "digital"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#704d31]"
              />
              <span className="font-medium text-[#5a3921]">Dompet Digital</span>
            </label>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-[#5a3921]">
              Total Harga
            </span>
            <span className="text-xl font-bold text-[#704d31]">
              Rp {totalHarga.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-[#704d31] hover:bg-[#5a3921] text-white py-4 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg mb-6"
        >
          Lanjut ke Pembayaran
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
