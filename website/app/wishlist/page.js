"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Trash2, Sparkles, ShoppingBag, ShoppingCart } from "lucide-react";
import { resolveImageUrl } from "../../lib/image";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const getCartStorageKey = () => {
    if (typeof window === "undefined") return "cartData";
    const userDataRaw = localStorage.getItem("userData");
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        if (userData?.id) {
          return `cartData_${userData.id}`;
        }
      } catch (error) {
        console.warn("Gagal membaca userData:", error);
      }
    }
    return "cartData";
  };

  useEffect(() => {
    const loadWishlist = () => {
      const saved = JSON.parse(localStorage.getItem("wishlistData") || "[]");
      setWishlist(saved);
    };

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("storage", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, []);

  const totalSelected = useMemo(() => selectedItems.length, [selectedItems]);

  const handleRemove = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlistData", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const baseCartItem = (product) => ({
    id: product.id,
    name: product.name,
    image: product.image || "/logo_batik.jpg",
    harga: product.price || product.harga,
    price: product.price || product.harga,
    jumlah: product.jumlah || 1,
    ukuran: product.size || product.ukuran || "L",
  });

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      alert("Pilih produk terlebih dahulu untuk ditambahkan ke keranjang.");
      return;
    }

    const cartKey = getCartStorageKey();
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const updatedCart = [...existingCart];

    wishlist
      .filter((item) => selectedItems.includes(item.id))
      .forEach((product) => {
        const existingItemIndex = updatedCart.findIndex(
          (cartItem) => cartItem.id === product.id && cartItem.ukuran === (product.size || "L")
        );
        if (existingItemIndex >= 0) {
          updatedCart[existingItemIndex].jumlah =
            (updatedCart[existingItemIndex].jumlah || 1) + 1;
        } else {
          updatedCart.push(baseCartItem(product));
        }
      });

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Produk pilihan berhasil ditambahkan ke keranjang.");
    router.push("/keranjang");
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Pilih produk terlebih dahulu untuk checkout.");
      return;
    }

    const selectedProducts = wishlist
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        ...baseCartItem(item),
      }));

    localStorage.setItem("checkoutData", JSON.stringify(selectedProducts));
    alert("Menuju halaman checkout...");
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-transparent pb-28 md:pb-0">
      <Navbar title="Wishlist" showBack />

      <div className="luxury-container space-y-8 md:space-y-10">
        <section className="luxury-section space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-[#c08a3e]">
              <Sparkles size={18} />
              <p className="text-xs uppercase tracking-[0.4em] font-semibold">
                Koleksi favoritmu
              </p>
            </div>
            {wishlist.length > 0 && (
              <span className="text-sm text-[#5c3316]/70">
                {totalSelected > 0
                  ? `${totalSelected} produk dipilih`
                  : "Pilih produk yang ingin kamu proses"}
              </span>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="glass-card mx-auto max-w-lg px-8 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdf3ec] text-[#c08a3e]">
                <ShoppingBag size={28} />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-[#5c3316]">
                Wishlist kamu masih kosong
              </h2>
              <p className="mt-3 text-sm text-[#5c3316]/70 leading-relaxed">
                Jelajahi koleksi batik eksklusif kami dan simpan produk favoritmu di sini agar
                mudah ditemukan nanti.
              </p>
              <button
                onClick={() => router.push("/Beranda")}
                className="mt-6 luxury-button primary-button text-sm px-6"
              >
                Jelajahi katalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="glass-card flex flex-col gap-4 rounded-[26px] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6"
                >
                  <div className="flex items-start gap-4 md:items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-2 h-5 w-5 rounded border-[#d1b799] text-[#7b4d2a] focus:ring-[#c08a3e] md:mt-0"
                    />
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#eadfd0] bg-white/70 shadow-inner">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/logo_batik.jpg";
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#c08a3e] font-semibold">
                        {item.category || "Batik Premium"}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-[#5c3316]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#5c3316]/60">
                        Ukuran: {item.size || "L"} • Stok: {item.stock || "Tersedia"}
                      </p>
                      <p className="mt-3 text-lg font-semibold text-[#7b4d2a]">
                        Rp {(item.price || item.harga || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="self-end rounded-full border border-transparent p-3 text-[#c45e3a] transition hover:border-[#f3c7b8] hover:bg-[#fff0eb]"
                    aria-label="Hapus dari wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {wishlist.length > 0 && (
          <div className="sticky bottom-24 z-30 mx-auto w-full md:static md:bottom-auto">
            <div className="glass-card flex flex-col gap-3 rounded-[26px] border border-[#e3d6c5] bg-white/85 px-5 py-4 backdrop-blur-md md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#5c3316]">
                  {totalSelected > 0
                    ? `${totalSelected} produk siap diproses`
                    : "Pilih produk untuk melanjutkan"}
                </p>
                <p className="text-xs text-[#5c3316]/60">
                  Kamu bisa menambahkan ke keranjang atau checkout langsung.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <button onClick={handleAddToCart} className="luxury-button primary-button text-sm">
                  <ShoppingCart size={16} />
                  Tambah ke keranjang
                </button>
                <button onClick={handleCheckout} className="luxury-button text-sm">
                  Lanjutkan checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

