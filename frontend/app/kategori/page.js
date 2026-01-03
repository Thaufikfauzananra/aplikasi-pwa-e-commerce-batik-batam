"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import CardProduk from "../../components/CardProduk";
import { Filter, ChevronDown, Sparkles } from "lucide-react";
import api from "../../lib/axios";

function KategoriContent() {
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

  const filterProducts = useMemo(
    () =>
      products.filter((p) => {
        if (
          selectedFilters.kategori &&
          p.name &&
          !p.name.toLowerCase().includes(selectedFilters.kategori.toLowerCase())
        ) {
          return false;
        }
        if (
          selectedFilters.ukuran &&
          Array.isArray(p.size) &&
          !p.size.includes(selectedFilters.ukuran)
        ) {
          return false;
        }
        return true;
      }),
    [products, selectedFilters]
  );

  const ukuranOptions = ["S", "M", "L", "XL", "XXL"];

  const filterCount = useMemo(
    () => [selectedFilters.kategori, selectedFilters.ukuran].filter(Boolean).length,
    [selectedFilters]
  );

  return (
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar title={categoryTitle} />

      <div className="luxury-container space-y-8 md:space-y-10">
        <section className="luxury-section space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-[#c08a3e]">
              <Sparkles size={18} />
              <span className="text-xs uppercase tracking-[0.4em] font-semibold">
                Kurasi pilihan batik
              </span>
            </div>
            <div className="text-sm text-[#5c3316]/70">
              {loading
                ? "Memuat produk terbaik kami..."
                : `${filterProducts.length} produk ditemukan`}
            </div>
          </div>

          <div className="luxury-scroll flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`luxury-button text-xs font-semibold ${
                showFilter || filterCount > 0 ? "primary-button" : ""
              }`}
            >
              <Filter size={16} />
              Filter
              {filterCount > 0 && (
                <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold">
                  {filterCount}
                </span>
              )}
              <ChevronDown
                size={16}
                className={`transition ${showFilter ? "rotate-180" : ""}`}
              />
            </button>
            <select
              value={selectedFilters.ukuran}
              onChange={(e) =>
                setSelectedFilters({ ...selectedFilters, ukuran: e.target.value })
              }
              className="luxury-button text-xs font-semibold bg-white/80"
            >
              <option value="">Semua ukuran</option>
              {ukuranOptions.map((ukuran) => (
                <option key={ukuran} value={ukuran}>
                  {ukuran}
                </option>
              ))}
            </select>
            {selectedFilters.kategori && (
              <span className="floating-badge bg-[#7b4d2a] text-white border-transparent">
                {selectedFilters.kategori}
              </span>
            )}
          </div>

          {showFilter && (
            <div className="glass-card space-y-4 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#c08a3e] font-semibold mb-3">
                  Pilih kategori
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Kemeja", "Blus", "Dress", "Celana"].map((kat) => (
                    <button
                      key={kat}
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          kategori: prev.kategori === kat ? "" : kat,
                        }))
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedFilters.kategori === kat
                          ? "bg-gradient-to-br from-[#7b4d2a] to-[#c4986c] text-white shadow"
                          : "border border-[#d1b799] text-[#5c3316] bg-white/80 hover:border-[#c08a3e]"
                      }`}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilter(false)}
                  className="luxury-button text-sm flex-1 justify-center"
                >
                  Selesai
                </button>
                <button
                  onClick={() => {
                    setSelectedFilters({ kategori: "", ukuran: "" });
                    setShowFilter(false);
                  }}
                  className="luxury-button text-sm flex-1 justify-center"
                >
                  Reset filter
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="luxury-skeleton h-64 rounded-3xl" />
              ))}
            </div>
          ) : filterProducts.length === 0 ? (
            <div className="glass-card mx-auto max-w-lg px-8 py-12 text-center">
              <h2 className="text-xl font-semibold text-[#5c3316]">
                Produk tidak ditemukan
              </h2>
              <p className="mt-3 text-sm text-[#5c3316]/70">
                {products.length === 0
                  ? "Pastikan backend Laravel sedang berjalan untuk menampilkan seluruh koleksi."
                  : "Coba ubah filter atau kata kunci pencarianmu untuk melihat koleksi lainnya."}
              </p>
              {products.length === 0 && (
                <div className="mt-6 rounded-2xl border border-[#f1d6b8] bg-[#fff6eb] px-4 py-4 text-left text-xs text-[#5c3316]">
                  <p className="font-semibold text-[#c08a3e]">Menyalakan backend</p>
                  <code className="mt-2 block rounded-lg bg-white/70 px-3 py-2">
                    cd backend
                    <br />
                    php artisan serve
                  </code>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
              {filterProducts.map((produk) => (
                <CardProduk key={produk.id} produk={produk} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

export default function KategoriPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent pb-24 md:pb-0">
        <Navbar title="Kategori Produk" />
        <div className="luxury-container flex items-center justify-center py-20">
          <div className="luxury-skeleton h-64 w-full max-w-md rounded-3xl" />
        </div>
        <BottomNav />
      </div>
    }>
      <KategoriContent />
    </Suspense>
  );
}
