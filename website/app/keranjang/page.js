"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Trash2, Edit2, ShoppingCart, X, MapPin, Sparkles, AlertTriangle } from "lucide-react";
import api from "../../lib/axios";
import { resolveImageUrl } from "../../lib/image";

export default function KeranjangPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [shippingAddress, setShippingAddress] = useState(null);
  const [cartWarnings, setCartWarnings] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });
  const [cartStorageKey, setCartStorageKey] = useState("cartData");
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const userDataRaw = localStorage.getItem("userData");
    let storageKey = "cartData";
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        if (userData?.id) {
          storageKey = `cartData_${userData.id}`;
        }
      } catch (error) {
        console.warn("Gagal parse userData:", error);
      }
    }
    setCartStorageKey(storageKey);

    const savedCart = JSON.parse(localStorage.getItem(storageKey) || "[]");
    syncCartWithProducts(savedCart);

    const savedPayment = localStorage.getItem("paymentMethod");
    if (savedPayment) {
      setPaymentMethod(savedPayment);
    }

    const savedAddress = localStorage.getItem("defaultAddress");
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error("Tidak dapat memuat defaultAddress:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleAddressUpdate = () => {
      const savedAddress = localStorage.getItem("defaultAddress");
      if (savedAddress) {
        try {
          setShippingAddress(JSON.parse(savedAddress));
        } catch (error) {
          console.error("Tidak dapat memuat defaultAddress:", error);
        }
      } else {
        setShippingAddress(null);
      }
    };

    window.addEventListener("storage", handleAddressUpdate);
    window.addEventListener("defaultAddressUpdated", handleAddressUpdate);

    return () => {
      window.removeEventListener("storage", handleAddressUpdate);
      window.removeEventListener("defaultAddressUpdated", handleAddressUpdate);
    };
  }, []);

  const syncCartWithProducts = async (initialCart) => {
    setLoadingCart(true);
    try {
      if (!initialCart || initialCart.length === 0) {
        setCart([]);
        setSelectedItems([]);
        setCartWarnings([]);
        return;
      }

      const res = await api.get("/products");
      const products = res.data.data || res.data || [];
      const productMap = new Map(products.map((product) => [String(product.id), product]));

      const warnings = [];
      const normalizedCart = initialCart.reduce((acc, item) => {
        const product = productMap.get(String(item.id));
        if (!product) {
          warnings.push({
            type: "unavailable",
            message: `${item.name || "Produk"} tidak lagi tersedia dan dihapus dari keranjang.`,
          });
          return acc;
        }

        const stock = Number(product.stock ?? 0);
        const price = Number(product.price ?? product.harga ?? 0);
        let quantity = Number(item.jumlah || 1);
        let unavailable = false;

        if (stock === 0) {
          unavailable = true;
          warnings.push({
            type: "stock",
            message: `${product.name} sedang kehabisan stok.`,
          });
        }

        if (quantity > stock && stock > 0) {
          warnings.push({
            type: "stock",
            message: `Jumlah ${product.name} disesuaikan ke ${stock} karena stok terbatas.`,
          });
          quantity = stock;
        }

        if (price !== item.harga && item.harga !== undefined) {
          warnings.push({
            type: "price",
            message: `Harga ${product.name} diperbarui menjadi Rp ${price.toLocaleString("id-ID")}.`,
          });
        }

        acc.push({
          ...item,
          name: product.name,
          category: product.category,
          image: product.image,
          harga: price,
          price,
          stock,
          jumlah: quantity,
          unavailable,
        });
        return acc;
      }, []);

      setCart(normalizedCart);
      setSelectedItems(
        normalizedCart.filter((item) => !item.unavailable).map((item) => item.id)
      );
      setCartWarnings(warnings);
      if (cartStorageKey) {
        localStorage.setItem(cartStorageKey, JSON.stringify(normalizedCart));
      }
    } catch (error) {
      console.error("Gagal sinkronisasi keranjang:", error);
    } finally {
      setLoadingCart(false);
    }
  };

  // Update localStorage when cart changes
  useEffect(() => {
    if (!cartStorageKey) return;
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart, cartStorageKey]);

  useEffect(() => {
    const selected = cart.filter((item) => selectedItems.includes(item.id));
    const subtotal = selected.reduce(
      (acc, item) => acc + Number(item.harga || item.price || 0) * (item.jumlah || 1),
      0
    );
    const discount = 0;
    const tax = Math.round(subtotal * 0.1);
    const shipping = selected.length > 0 ? 20000 : 0;
    const total = subtotal - discount + tax + shipping;

    setCartSummary({
      subtotal,
      discount,
      tax,
      shipping,
      total,
    });
  }, [cart, selectedItems]);

  const addWarning = (message) => {
    setCartWarnings((prev) => {
      if (prev.some((warn) => warn.message === message)) return prev;
      return [...prev, { message }];
    });
  };

  const updateJumlah = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const stok = Number(item.stock ?? 99);
          let jumlahBaru =
            type === "tambah"
              ? (item.jumlah || 1) + 1
              : item.jumlah > 1
              ? item.jumlah - 1
              : 1;
          if (jumlahBaru > stok) {
            jumlahBaru = stok;
            addWarning(`Jumlah ${item.name} tidak bisa melebihi stok (${stok}).`);
          }
          return { ...item, jumlah: jumlahBaru };
        }
        return item;
      })
    );
  };

  const toggleSelect = (key, unavailable) => {
    if (unavailable) return;
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((itemId) => itemId !== key) : [...prev, key]
    );
  };

  const handleHapus = (key) => {
    const [deleteId, deleteSize] = String(key).split("||");
    const updatedCart = cart.filter(
      (item) =>
        !(
          String(item.id) === deleteId &&
          String(item.ukuran || item.size || "") === deleteSize
        )
    );
    setCart(updatedCart);
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== key));
    if (cartStorageKey) {
      localStorage.setItem(cartStorageKey, JSON.stringify(updatedCart));
    }
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(`${item.id}||${item.ukuran || item.size || ""}`)
    );
    if (selectedProducts.length === 0) {
      alert("Pilih produk dulu untuk checkout");
      return;
    }
    if (!shippingAddress) {
      alert("Lengkapi alamat pengiriman terlebih dahulu.");
      return;
    }
    const hasUnavailable = selectedProducts.some((item) => item.unavailable);
    if (hasUnavailable) {
      alert("Hapus produk yang stoknya habis sebelum melanjutkan checkout.");
      return;
    }
    const overStock = selectedProducts.some(
      (item) => item.stock !== undefined && item.jumlah > item.stock
    );
    if (overStock) {
      alert("Periksa kembali jumlah produk, ada yang melebihi stok.");
      return;
    }
    localStorage.setItem("checkoutData", JSON.stringify(selectedProducts));
    localStorage.setItem("paymentMethod", paymentMethod);
    router.push("/checkout");
  };

  const renderEmptyState = () => (
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar title="Keranjang Belanja" showBack />
      <div className="luxury-container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="glass-card flex h-44 w-44 items-center justify-center rounded-[36px] bg-white/85 shadow-[0_30px_70px_-40px_rgba(91,55,23,0.55)]">
          <div className="relative">
            <ShoppingCart size={96} className="text-[#e3d6c5]" />
            <X
              size={56}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#c45e3a]"
            />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-semibold text-[#5c3316]">Keranjangmu masih kosong</h2>
        <p className="mt-3 max-w-md text-sm text-[#5c3316]/70">
          Simpan koleksi favoritmu ke keranjang untuk dilanjutkan ke checkout. Jelajahi motif
          eksklusif kami dan pilih batik yang kamu suka.
        </p>
        <Link href="/Beranda" className="mt-6 luxury-button primary-button text-sm px-8">
          Mulai belanja
        </Link>
      </div>
      <BottomNav />
    </div>
  );

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-skeleton h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (cart.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="min-h-screen bg-transparent pb-32 md:pb-10">
      <Navbar title="Keranjang Belanja" showBack />

      <div className="luxury-container space-y-8 md:space-y-10">
        {cartWarnings.length > 0 && (
          <section className="glass-card rounded-[28px] border border-[#f6d9b5] bg-[#fff7ee] px-5 py-4">
            <div className="flex items-center gap-2 text-[#a5632b] mb-2">
              <AlertTriangle size={18} />
              <p className="font-semibold text-sm uppercase tracking-[0.25em]">
                Perlu perhatian
              </p>
            </div>
            <ul className="space-y-1 text-sm text-[#5c3316]">
              {cartWarnings.map((warning, idx) => (
                <li key={`${warning.message}-${idx}`} className="flex items-start gap-2">
                  <span className="mt-1 text-[#c08a3e]">•</span>
                  <span>{warning.message}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="luxury-section space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-[#c08a3e]">
              <Sparkles size={18} />
              <span className="text-xs uppercase tracking-[0.4em] font-semibold">
                Koleksi siap checkout
              </span>
            </div>
            <p className="text-sm text-[#5c3316]/70">
              {selectedItems.length === cart.length
                ? "Semua produk dipilih"
                : `${selectedItems.length} dari ${cart.length} produk dipilih`}
            </p>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.ukuran || item.size || ""}`}
                className="glass-card rounded-[26px] border border-[#e3d6c5]/80 bg-white/80 px-4 py-4 shadow-[0_20px_60px_-40px_rgba(91,55,23,0.65)] transition hover:-translate-y-[2px] md:px-6 md:py-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(`${item.id}||${item.ukuran || item.size || ""}`)}
                      onChange={() => toggleSelect(`${item.id}||${item.ukuran || item.size || ""}`, item.unavailable)}
                      disabled={item.unavailable}
                      className="h-5 w-5 accent-[#7b4d2a]"
                    />
                    {item.unavailable && (
                      <span className="rounded-full bg-[#ffe5e5] px-3 py-1 text-xs font-semibold text-[#c04545]">
                        Stok habis
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-3xl border border-[#eadfd0] bg-white/70 shadow-inner md:h-32 md:w-32">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/logo_batik.jpg";
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#c08a3e] font-semibold">
                          {item.category || "Batik Premium"}
                        </p>
                        <h3 className="text-lg font-semibold text-[#5c3316] leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#5c3316]/60">
                          Ukuran: {item.ukuran || item.size || "L"} • Qty: {item.jumlah || 1}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xl font-semibold text-[#7b4d2a]">
                          Rp {(item.harga || item.price || 0).toLocaleString("id-ID")}
                        </p>
                        <button
                          onClick={() => handleHapus(`${item.id}||${item.ukuran || item.size || ""}`)}
                          className="rounded-full border border-transparent p-2 text-[#c45e3a] transition hover:border-[#f3c7b8] hover:bg-[#fff0eb]"
                          aria-label="Hapus produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-2xl border border-[#d1b799] bg-white/75 shadow-inner">
                        <button
                          onClick={() => updateJumlah(item.id, "kurang")}
                          className="h-10 w-10 text-[#7b4d2a] transition hover:bg-[#fdf3ec]"
                          aria-label="Kurangi jumlah"
                        >
                          −
                        </button>
                        <span className="w-12 text-center text-base font-semibold text-[#5c3316]">
                          {item.jumlah || 1}
                        </span>
                        <button
                          onClick={() => updateJumlah(item.id, "tambah")}
                          className="h-10 w-10 text-[#7b4d2a] transition hover:bg-[#fdf3ec]"
                          aria-label="Tambah jumlah"
                        >
                          +
                        </button>
                      </div>
                      <button className="rounded-full border border-[#eadfd0] bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c08a3e]">
                        Koleksi terbaik
                      </button>
                      <p className="text-sm font-semibold text-[#5c3316]/70">
                        Total: Rp {((item.harga || item.price || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-[28px] border border-[#e3d6c5] bg-white/85 px-5 py-5 backdrop-blur-md md:px-7 md:py-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#fdf3ec] text-[#704d31]">
                <MapPin size={18} />
              </div>
              <h3 className="font-semibold text-[#5c3316]">Alamat Pengiriman</h3>
            </div>
            <button
              onClick={() => router.push("/alamat")}
              className="luxury-button text-xs"
            >
              <Edit2 size={14} />
              <span className="text-sm font-semibold">Ubah</span>
            </button>
          </div>
          {shippingAddress ? (
            <div>
              <p className="text-sm font-semibold text-[#5c3316] uppercase tracking-[0.3em]">
                {shippingAddress.label}
              </p>
              <p className="text-sm text-[#5a3921]/70 mt-2">
                {shippingAddress.recipient_name} • {shippingAddress.recipient_phone}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {shippingAddress.address}
              </p>
              <p className="text-xs text-[#b08968] mt-1 uppercase tracking-[0.2em]">
                {shippingAddress.district}, {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#e7d9c6] bg-[#fefaf6] px-4 py-3 text-sm text-[#5a3921]/70">
              Belum ada alamat default. Tambahkan alamat pengiriman di menu profil agar proses checkout lebih cepat.
            </div>
          )}
        </section>

        <section className="glass-card rounded-[28px] border border-[#e3d6c5] bg-white/85 px-5 py-5 backdrop-blur-md md:px-7 md:py-6">
          <h3 className="font-semibold text-[#5c3316] mb-3">Metode Pembayaran</h3>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition ${
                paymentMethod === "transfer"
                  ? "border-[#7b4d2a] bg-gradient-to-br from-[#fdf3ec] to-[#fff7ef]"
                  : "border-[#e7d9c6] bg-white/80 hover:bg-[#fefaf6]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 accent-[#7b4d2a]"
              />
              <div>
                <span className="font-semibold text-[#5c3316]">Transfer Bank</span>
                <p className="text-xs text-[#5c3316]/60">BCA • Mandiri • BNI • BRI</p>
              </div>
            </label>
            <label
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition ${
                paymentMethod === "digital"
                  ? "border-[#7b4d2a] bg-gradient-to-br from-[#fdf3ec] to-[#fff7ef]"
                  : "border-[#e7d9c6] bg-white/80 hover:bg-[#fefaf6]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="digital"
                checked={paymentMethod === "digital"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 accent-[#7b4d2a]"
              />
              <div>
                <span className="font-semibold text-[#5c3316]">Dompet Digital</span>
                <p className="text-xs text-[#5c3316]/60">OVO • GoPay • Dana • ShopeePay</p>
              </div>
            </label>
          </div>
        </section>

        <section className="glass-card rounded-[28px] border border-[#e3d6c5] bg-white/85 px-5 py-5 backdrop-blur-md md:px-7 md:py-6">
          <div className="space-y-2 text-sm text-[#5c3316]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>Rp {cartSummary.subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Diskon</span>
              <span>- Rp {cartSummary.discount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pajak (10%)</span>
              <span>Rp {cartSummary.tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ongkos Kirim</span>
              <span>Rp {cartSummary.shipping.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-[#eadfd0] pt-3 flex items-center justify-between text-base font-semibold text-[#7b4d2a]">
              <span>Total Pembayaran</span>
              <span>Rp {cartSummary.total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </section>

        <button
          onClick={handleCheckout}
          className="w-full luxury-button primary-button text-lg justify-center md:text-xl"
        >
          Lanjut ke Pembayaran
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
