"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import Banner from "../../components/Banner";
import KategoriList from "../../components/KategoriList";
import CardProduk from "../../components/CardProduk";
import api from "../../lib/axios";

export default function BerandaPembeli() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      getProducts();
    }
    
    // Refresh produk saat halaman mendapat fokus (setelah kembali dari halaman lain)
    const handleFocus = () => {
      getProducts();
    };
    window.addEventListener('focus', handleFocus);
    
    // Listen untuk event productsUpdated
    const handleProductsUpdate = () => {
      getProducts();
    };
    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    // Refresh setiap 30 detik untuk update produk baru
    const interval = setInterval(() => {
      getProducts();
    }, 30000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('productsUpdated', handleProductsUpdate);
      clearInterval(interval);
    };
  }, []);

  const getProducts = async () => {
    try {
      console.log("🔍 Mencoba ambil produk dari backend...");
      const res = await api.get("/products");
      console.log("✅ Produk berhasil diambil:", res.data);
      setProducts(res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil produk:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          method: err.config?.method,
        }
      });
      
      // Tampilkan warning jika backend tidak running
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        console.warn('⚠️ Tidak bisa terhubung ke backend!');
        console.warn('📝 Kemungkinan penyebab:');
        console.warn('   1. Backend tidak running - Cek: http://127.0.0.1:8000/api/products');
        console.warn('   2. File .env.local tidak ada atau salah');
        console.warn('   3. Frontend belum restart setelah edit config');
        console.warn('   4. CORS issue - cek browser console untuk detail');
        console.warn('   5. RESTART FRONTEND dengan: Ctrl+C lalu npm run dev');
      }
      
      // Fallback data sementara jika backend tidak running
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefaf6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704d31] mx-auto mb-4"></div>
          <p className="text-[#5a3921]">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      {/* Navbar */}
      <Navbar title="Beranda pembeli" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Banner */}
        <Banner />

        {/* Kategori */}
        <KategoriList />

        {/* Produk Terbaru */}
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#5a3921] mb-4 px-2 md:px-0">
            Produk Terbaru
          </h3>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Belum ada produk tersedia.</p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Backend tidak terhubung</p>
                <p className="text-xs text-yellow-700 mb-2">
                  Pastikan backend Laravel sudah running:
                </p>
                <code className="block text-xs bg-yellow-100 p-2 rounded mt-2 text-left">
                  cd backend<br />
                  php artisan serve
                </code>
                <p className="text-xs text-yellow-600 mt-2">
                  Backend harus running di: <strong>http://127.0.0.1:8000</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-2 md:px-0">
              {products.map((produk) => (
                <CardProduk key={produk.id} produk={produk} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}
