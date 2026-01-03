"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "../../../components/AdminSidebar";
import api from "../../../lib/axios";
import { resolveImageUrl } from "../../../lib/image";

export default function AdminProduk() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek role
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", {
          timeout: 30000, // Increase timeout to 30 seconds
        });
        setProducts(res.data.data || res.data || []);
      } catch (err) {
        console.error("❌ Gagal ambil produk:", err);
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
        });
        
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          console.error("⚠️ Timeout! Backend tidak merespons dalam 30 detik");
          console.error("💡 Pastikan backend Laravel sudah running: cd backend && php artisan serve");
        } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
          console.error("⚠️ Network Error! Tidak bisa terhubung ke backend");
          console.error("💡 Pastikan backend Laravel sudah running: cd backend && php artisan serve");
        }
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Refresh data saat halaman mendapat fokus (setelah kembali dari tambah/edit)
    const handleFocus = () => {
      fetchProducts();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu");
        return;
      }

      const response = await api.delete(`/products/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        alert("Produk berhasil dihapus");
        // Refresh products list
        const res = await api.get("/products");
        setProducts(res.data.data || res.data || []);
      } else {
        throw new Error(response.data.message || "Gagal menghapus produk");
      }
    } catch (err) {
      console.error("Gagal hapus produk:", err);
      let errorMessage = "Gagal menghapus produk";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704d31]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F6F3EC" }}>
      <AdminSidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen" style={{ backgroundColor: "#F6F3EC" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#5a3921]">
              Produk
            </h1>
            <Link
              href="/admin/produk/tambah"
              className="bg-[#704d31] hover:bg-[#5a3921] text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Tambah Produk
            </Link>
          </div>

          <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: "#F6F3EC" }}>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gambar</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Harga</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stok</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 bg-white">
                      Belum ada produk
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id} className="border-t border-gray-200 bg-white">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 bg-white rounded overflow-hidden">
                          {product.image && (
                            <img
                              src={resolveImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/logo_batik.jpg";
                              }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">{product.category || "-"}</td>
                      <td className="px-4 py-3">
                        Rp {product.price?.toLocaleString("id-ID") || 0}
                      </td>
                      <td className="px-4 py-3">{product.stock || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/produk/edit/${product.id}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

