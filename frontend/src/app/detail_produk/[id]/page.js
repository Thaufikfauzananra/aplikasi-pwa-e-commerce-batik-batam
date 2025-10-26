"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { dataProduk } from "@/lib/data/dataProduk";

export default function DetailProduk() {
  const { id } = useParams();
  const router = useRouter();
  const [produk, setProduk] = useState(null);
  const [ukuran, setUkuran] = useState("");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const found = dataProduk.find((item) => item.id === id);
    setProduk(found);
    const savedWishlist = JSON.parse(localStorage.getItem("wishlistData")) || [];
    setWishlist(savedWishlist.map((p) => p.id));
  }, [id]);

  if (!produk)
    return <p className="p-6 text-center">Memuat detail produk...</p>;

  const handleAddToCart = () => {
    if (!ukuran) return alert("Pilih ukuran dulu 👕");
    const cart = JSON.parse(localStorage.getItem("cartData")) || [];
    const existing = cart.find((item) => item.id === produk.id);
    if (existing) {
      existing.jumlah = (existing.jumlah || 1) + 1;
    } else {
      cart.push({
        id: produk.id,
        name: produk.name,
        price: produk.price,
        image: produk.image,
        ukuran,
        stok: produk.stok,
        jumlah: 1,
      });
    }
    localStorage.setItem("cartData", JSON.stringify(cart));
    alert("Produk berhasil ditambahkan ke keranjang 🛒");
    router.push("/keranjang");
  };

  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#5a3921] pb-24">
      <header className="flex items-center gap-3 px-6 py-4 bg-white shadow-md">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 text-[#704d31]" />
        </button>
        <h1 className="text-lg font-semibold">{produk.name}</h1>
      </header>

      <div className="relative w-full h-80">
        <Image src={produk.image} alt={produk.name} fill className="object-cover" />
        <button
          className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-[#fdf3ec]"
        >
          <Heart size={22} className="text-[#704d31]" />
        </button>
      </div>

      <div className="px-6 mt-4">
        <h2 className="text-xl font-semibold">{produk.name}</h2>
        <p className="text-[#704d31] text-lg font-semibold mt-1">
          Rp {produk.price.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-gray-600 mt-1">Bahan: {produk.bahan}</p>
        <p className="text-sm text-gray-600">Warna: {produk.warna}</p>
        <p className="text-sm text-gray-600">Stok: {produk.stok}</p>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Pilih Ukuran:</p>
          <div className="flex gap-2">
            {produk.ukuran.map((u) => (
              <button
                key={u}
                onClick={() => setUkuran(u)}
                className={`px-3 py-1 border rounded-full text-sm ${
                  ukuran === u
                    ? "bg-[#704d31] text-white border-[#704d31]"
                    : "border-[#b08968] hover:bg-[#fdf3ec]"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-sm text-gray-700">{produk.deskripsi}</p>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 border border-[#704d31] text-[#704d31] py-3 rounded-lg font-medium hover:bg-[#fdf3ec]"
          >
            Tambah ke Keranjang
          </button>
          <button
            onClick={() => {
              if (!ukuran) return alert("Pilih ukuran dulu 👕");
              localStorage.setItem(
                "checkoutData",
                JSON.stringify([{ ...produk, ukuran, jumlah: 1 }])
              );
              router.push("/pembayaran");
            }}
            className="flex-1 bg-[#704d31] text-white py-3 rounded-lg font-medium hover:bg-[#5a3921]"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
