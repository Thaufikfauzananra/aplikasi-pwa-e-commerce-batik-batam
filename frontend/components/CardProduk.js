"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { resolveImageUrl } from "../lib/image";

export default function CardProduk({ produk }) {
  const [isFavorite, setIsFavorite] = useState(false);
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

  // Cek apakah produk sudah ada di wishlist saat component mount
  useEffect(() => {
    if (produk?.id) {
      const wishlist = JSON.parse(localStorage.getItem("wishlistData") || "[]");
      const exists = wishlist.some(item => item.id === produk.id);
      setIsFavorite(exists);
    }
  }, [produk?.id]);

  // Listen untuk perubahan wishlist dari komponen lain
  useEffect(() => {
    const handleStorageChange = () => {
      if (produk?.id) {
        const wishlist = JSON.parse(localStorage.getItem("wishlistData") || "[]");
        const exists = wishlist.some(item => item.id === produk.id);
        setIsFavorite(exists);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, [produk?.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const cartKey = getCartStorageKey();
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const existingItem = cart.find(item => item.id === produk.id);
    
    if (existingItem) {
      existingItem.jumlah = (existingItem.jumlah || 1) + 1;
    } else {
      const storedImage = resolveImageUrl(produk.image || produk.gambar);
      cart.push({
        id: produk.id,
        name: produk.name || produk.nama,
        image: storedImage,
        harga: produk.price || produk.harga,
        jumlah: 1,
        ukuran: produk.size || produk.ukuran || "L",
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Trigger custom event for cart update
    window.dispatchEvent(new Event('storage'));
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!produk?.id) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlistData") || "[]");
    
    if (isFavorite) {
      // Hapus dari wishlist
      const updated = wishlist.filter(item => item.id !== produk.id);
      localStorage.setItem("wishlistData", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // Tambah ke wishlist
      const storedImage = resolveImageUrl(produk.image || produk.gambar);
      const wishlistItem = {
        id: produk.id,
        name: produk.name || produk.nama,
        image: storedImage,
        price: produk.price || produk.harga,
        size: produk.size || produk.ukuran,
        stock: produk.stock || produk.stok,
      };
      
      // Cek apakah sudah ada di wishlist
      const exists = wishlist.some(item => item.id === produk.id);
      if (!exists) {
        wishlist.push(wishlistItem);
        localStorage.setItem("wishlistData", JSON.stringify(wishlist));
        setIsFavorite(true);
      }
    }
    
    // Trigger event untuk update wishlist counter di navbar
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const productName = produk.name || produk.nama || "Nama Produk";
  const productPrice = Number(produk.price || produk.harga || 0);
  const productImage = resolveImageUrl(produk.image || produk.gambar);
  const productStock = produk.stock ?? produk.stok;

  return (
    <Link
      href={`/detail_produk/${produk.id}`}
      className="group block h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e3d6c5]/70 bg-white/80 backdrop-blur-[6px] shadow-[0_22px_55px_-30px_rgba(91,55,23,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_90px_-45px_rgba(91,55,23,0.65)]">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#f4e5d3] via-[#fff6eb] to-[#fffdfa]">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={productImage?.startsWith("http") || productImage?.startsWith("/storage/")}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/logo_batik.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="floating-badge bg-white/85 border-white/70 text-[#7b4d2a]">
              Koleksi baru
            </span>
            {typeof productStock !== "undefined" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-[#5c3316] shadow-sm border border-white/70">
                Stok {productStock}
              </span>
            )}
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md transition ${
              isFavorite ? "text-[#c45e3a]" : "text-[#7b4d2a]"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c08a3e]">
              Batik Signature
            </p>
            <h3 className="text-base font-semibold text-[#5c3316] leading-snug line-clamp-2">
              {productName}
            </h3>
          </div>
          <div className="mt-auto space-y-3">
            <p className="text-lg font-semibold text-[#7b4d2a]">
              Rp {productPrice.toLocaleString("id-ID")}
            </p>
            <button
              onClick={handleAddToCart}
              className="w-full luxury-button primary-button text-sm"
            >
              <ShoppingCart size={16} />
              Tambahkan ke keranjang
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

