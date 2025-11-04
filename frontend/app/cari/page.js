"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import CardProduk from "../../components/CardProduk";
import { Search, X } from "lucide-react";
import api from "../../lib/axios";

export default function CariPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Baca query dari URL saat pertama kali load
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }

    getProducts();
  }, [searchParams, router]);

  useEffect(() => {
    // Filter products berdasarkan search query
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = products.filter((product) => {
        const name = (product.name || product.nama || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        
        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const getProducts = async () => {
    try {
      const res = await api.get("/products", {
        timeout: 30000,
      });
      const productList = res.data.data || res.data || [];
      setProducts(productList);
      setFilteredProducts(productList);
    } catch (err) {
      console.error("❌ Gagal ambil produk:", err);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Update URL dengan query parameter
    if (searchQuery.trim()) {
      router.push(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/cari");
    }
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar title="Cari Produk" showBack={true} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b08968]" size={20} />
              <input
                type="text"
                placeholder="Cari produk, kategori, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-[#b08968] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704d31] mx-auto"></div>
            <p className="mt-4 text-[#5a3921]">Memuat produk...</p>
          </div>
        ) : (
          <>
            {/* Search Results Info */}
            <div className="mb-4">
              {searchQuery.trim() ? (
                <p className="text-[#5a3921]">
                  Menampilkan <strong>{filteredProducts.length}</strong> hasil untuk "
                  <strong>{searchQuery}</strong>"
                </p>
              ) : (
                <p className="text-[#5a3921]">
                  Semua produk (<strong>{products.length}</strong>)
                </p>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 text-lg mb-2">
                  {searchQuery.trim()
                    ? "Produk tidak ditemukan"
                    : "Belum ada produk tersedia"}
                </p>
                {searchQuery.trim() && (
                  <p className="text-gray-400 text-sm">
                    Coba gunakan kata kunci lain atau hapus filter pencarian
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredProducts.map((produk) => (
                  <CardProduk key={produk.id} produk={produk} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

