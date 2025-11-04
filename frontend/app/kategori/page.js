"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import CardProduk from "../../components/CardProduk";
import { Filter, ChevronDown } from "lucide-react";
import api from "../../lib/axios";

export default function KategoriPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryType = searchParams.get("type") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    kategori: categoryType === "wanita" ? "Kemeja" : "",
    ukuran: "",
  });

  const categoryTitle = categoryType === "wanita" ? "Pakaian Wanita" 
    : categoryType === "pria" ? "Pakaian Pria"
    : categoryType === "aksesoris" ? "Aksesoris"
    : categoryType === "kain" ? "Kain"
    : "Kategori Produk";

  useEffect(() => {
    getProducts();
  }, [categoryType]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      let productsData = res.data.data || res.data || [];
      
      // Filter by category type if specified
      if (categoryType) {
        productsData = productsData.filter(p => 
          (p.category && p.category.toLowerCase().includes(categoryType.toLowerCase())) ||
          (p.name && p.name.toLowerCase().includes(categoryType.toLowerCase()))
        );
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
      // Set fallback empty array jika backend tidak running
      setProducts([]);
      
      // Tampilkan warning di console
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        console.warn('⚠️ Backend tidak running!');
        console.warn('📝 Cara menjalankan backend:');
        console.warn('   1. Buka terminal baru');
        console.warn('   2. cd backend');
        console.warn('   3. php artisan serve');
        console.warn('   4. Refresh halaman ini');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = products.filter(p => {
    if (selectedFilters.kategori && p.name && !p.name.toLowerCase().includes(selectedFilters.kategori.toLowerCase())) {
      return false;
    }
    if (selectedFilters.ukuran && p.size && !p.size.includes(selectedFilters.ukuran)) {
      return false;
    }
    return true;
  });

  const ukuranOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar title={categoryTitle} showBack={false} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              showFilter || selectedFilters.kategori || selectedFilters.ukuran
                ? "bg-[#704d31] text-white"
                : "bg-white text-[#5a3921] border border-[#b08968] hover:bg-[#fdf3ec]"
            }`}
          >
            <Filter size={16} />
            Filter
            {(selectedFilters.kategori || selectedFilters.ukuran) && (
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                {[selectedFilters.kategori, selectedFilters.ukuran].filter(Boolean).length}
              </span>
            )}
            <ChevronDown size={16} className={`transition ${showFilter ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Tags */}
          {selectedFilters.kategori && (
            <span className="px-3 py-1 bg-[#704d31] text-white text-xs rounded-full">
              {selectedFilters.kategori}
            </span>
          )}
          {selectedFilters.kategori === "Kemeja" && (
            <span className="px-3 py-1 bg-[#704d31] text-white text-xs rounded-full">
              Batik
            </span>
          )}

          {/* Ukuran Dropdown */}
          <select
            value={selectedFilters.ukuran}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, ukuran: e.target.value })}
            className="px-4 py-2 bg-white border border-[#b08968] rounded-lg text-sm text-[#5a3921] focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
          >
            <option value="">Ukuran</option>
            {ukuranOptions.map(ukuran => (
              <option key={ukuran} value={ukuran}>{ukuran}</option>
            ))}
          </select>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="bg-white rounded-xl shadow-lg border border-[#d6c2aa] p-4 mb-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#704d31] mb-2">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {["Kemeja", "Blus", "Dress", "Celana"].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setSelectedFilters({ 
                      ...selectedFilters, 
                      kategori: selectedFilters.kategori === kat ? "" : kat 
                    })}
                    className={`px-3 py-1 text-sm rounded-full border transition ${
                      selectedFilters.kategori === kat
                        ? "bg-[#704d31] text-white border-[#704d31]"
                        : "border-[#b08968] hover:bg-[#fdf3ec] text-[#5a3921]"
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedFilters({ kategori: "", ukuran: "" });
                setShowFilter(false);
              }}
              className="w-full mt-2 border border-[#d6c2aa] py-2 rounded-lg text-sm text-[#704d31] hover:bg-[#fdf3ec] transition"
            >
              Hapus Filter
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704d31] mx-auto mb-4"></div>
            <p className="text-[#5a3921]">Memuat produk...</p>
          </div>
        ) : filterProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              {products.length === 0 
                ? "Backend tidak terhubung atau tidak ada produk."
                : "Tidak ada produk ditemukan dengan filter yang dipilih."}
            </p>
            {products.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Backend tidak running</p>
                <p className="text-xs text-yellow-700 mb-2">
                  Untuk menjalankan backend, buka terminal baru dan jalankan:
                </p>
                <code className="block text-xs bg-yellow-100 p-2 rounded mt-2">
                  cd backend<br />
                  php artisan serve
                </code>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filterProducts.map((produk) => (
              <CardProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
