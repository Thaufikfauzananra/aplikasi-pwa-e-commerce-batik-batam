"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import BottomNav from "../../../components/BottomNav";
import { Heart, ShoppingCart } from "lucide-react";
import api from "../../../lib/axios";

export default function DetailProduk() {
  const { id } = useParams();
  const router = useRouter();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProduct();
    const checkWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlistData") || "[]");
      setIsFavorite(wishlist.some(item => item.id === id));
    };
    
    // Check pertama kali
    checkWishlist();
    
    // Listen untuk perubahan wishlist dari komponen lain
    const handleWishlistUpdate = () => {
      checkWishlist();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('storage', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', handleWishlistUpdate);
    };
  }, [id]);

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduk(res.data.data || res.data);
      const sizes = res.data.data?.size || res.data?.size || ["S", "M", "L", "XL"];
      if (sizes.length > 0 && !selectedSize) {
        setSelectedSize(sizes[0]);
      }
    } catch (err) {
      console.error("Gagal ambil produk:", err);
      // Fallback data
      setProduk({
        id,
        name: "Produk Batik",
        price: 249000,
        image: "/logo_batik.jpg",
        description: "Produk batik berkualitas tinggi dengan motif tradisional.",
        size: ["S", "M", "L", "XL"],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Pilih ukuran terlebih dahulu");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cartData") || "[]");
    const existingItem = cart.find(item => item.id === produk.id && item.ukuran === selectedSize);
    
    if (existingItem) {
      existingItem.jumlah += quantity;
    } else {
      cart.push({
        id: produk.id,
        name: produk.name || produk.nama,
        image: produk.image || produk.gambar || "/logo_batik.jpg",
        harga: produk.price || produk.harga,
        ukuran: selectedSize,
        jumlah: quantity,
      });
    }
    
    localStorage.setItem("cartData", JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert("Produk berhasil ditambahkan ke keranjang!");
  };

  const handleToggleFavorite = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlistData") || "[]");
    if (isFavorite) {
      const updated = wishlist.filter(item => item.id !== produk.id);
      localStorage.setItem("wishlistData", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      wishlist.push({
        id: produk.id,
        name: produk.name || produk.nama,
        image: produk.image || produk.gambar || "/logo_batik.jpg",
        price: produk.price || produk.harga,
      });
      localStorage.setItem("wishlistData", JSON.stringify(wishlist));
      setIsFavorite(true);
    }
    // Trigger event untuk update komponen lain
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefaf6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704d31] mx-auto mb-4"></div>
          <p className="text-[#5a3921]">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="min-h-screen bg-[#fefaf6] flex items-center justify-center">
        <p className="text-[#5a3921]">Produk tidak ditemukan</p>
      </div>
    );
  }

  const sizes = produk.size || produk.ukuran || ["S", "M", "L", "XL"];
  const description = produk.description || produk.deskripsi || "Produk batik berkualitas tinggi dengan motif tradisional yang elegan dan nyaman digunakan.";

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar showBack={true} />

      <div className="max-w-4xl mx-auto">
        {/* Product Image */}
        <div className="relative w-full h-80 md:h-96 bg-gray-100">
          <Image
            src={produk.image || produk.gambar || "/logo_batik.jpg"}
            alt={produk.name || produk.nama || "Produk"}
            fill
            className="object-cover"
          />
          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition"
          >
            <Heart 
              size={24} 
              className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} 
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-white px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#5a3921] mb-2">
                {produk.name || produk.nama || "Nama Produk"}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-[#704d31]">
                Rp {Number(produk.price || produk.harga || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#5a3921] mb-3">Pilih Ukuran:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedSize === size
                      ? "bg-[#704d31] text-white shadow-md"
                      : "bg-white border-2 border-[#b08968] text-[#5a3921] hover:bg-[#fdf3ec]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#5a3921] mb-3">Jumlah:</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border-2 border-[#b08968] rounded-lg text-[#704d31] font-semibold hover:bg-[#fdf3ec] transition"
              >
                -
              </button>
              <span className="text-lg font-semibold text-[#5a3921] w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center border-2 border-[#b08968] rounded-lg text-[#704d31] font-semibold hover:bg-[#fdf3ec] transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#5a3921] mb-3">Deskripsi Produk</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#704d31] hover:bg-[#5a3921] text-white py-3 md:py-4 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
              <ShoppingCart size={20} />
              <span>Masukkan Keranjang</span>
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                router.push("/checkout");
              }}
              className="flex-1 border-2 border-[#704d31] text-[#704d31] py-3 md:py-4 rounded-lg font-semibold hover:bg-[#fdf3ec] transition"
            >
              Lihat Detail Pembayaran
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
