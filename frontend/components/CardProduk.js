"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function CardProduk({ produk }) {
  const [isFavorite, setIsFavorite] = useState(false);

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
    const cart = JSON.parse(localStorage.getItem("cartData") || "[]");
    const existingItem = cart.find(item => item.id === produk.id);
    
    if (existingItem) {
      existingItem.jumlah = (existingItem.jumlah || 1) + 1;
    } else {
      cart.push({
        id: produk.id,
        name: produk.name || produk.nama,
        image: produk.image || produk.gambar || "/logo_batik.jpg",
        harga: produk.price || produk.harga,
        jumlah: 1,
        ukuran: produk.size || produk.ukuran || "L",
      });
    }
    
    localStorage.setItem("cartData", JSON.stringify(cart));
    
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
      const wishlistItem = {
        id: produk.id,
        name: produk.name || produk.nama,
        image: produk.image || produk.gambar || "/logo_batik.jpg",
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

  return (
    <Link href={`/detail_produk/${produk.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <Image
            src={
              produk.image || produk.gambar || "/logo_batik.jpg"
            }
            alt={produk.name || produk.nama || "Produk"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={produk.image?.startsWith('http') || produk.image?.startsWith('/storage/')}
            onError={(e) => {
              e.target.src = "/logo_batik.jpg";
            }}
          />
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition ${
                isFavorite ? "text-red-500" : "text-gray-600"
              }`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-[#5a3921] line-clamp-2 mb-1">
            {produk.name || produk.nama || "Nama Produk"}
          </h3>
          <p className="text-sm font-semibold text-[#704d31] mb-2">
            Rp {Number(produk.price || produk.harga || 0).toLocaleString("id-ID")}
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-[#704d31] hover:bg-[#5a3921] text-white py-2 rounded-md text-xs font-medium transition"
          >
            <ShoppingCart size={14} />
            <span>Tambahkan</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

