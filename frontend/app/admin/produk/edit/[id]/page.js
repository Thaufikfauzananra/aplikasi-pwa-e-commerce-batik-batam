"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "../../../../../components/AdminSidebar";
import api from "../../../../../lib/axios";

export default function EditProduk() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
    size: [], // Array untuk menyimpan ukuran yang dipilih
  });

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const handleSizeChange = (size) => {
    setFormData((prev) => {
      if (prev.size.includes(size)) {
        // Hapus ukuran jika sudah dipilih
        return { ...prev, size: prev.size.filter((s) => s !== size) };
      } else {
        // Tambah ukuran jika belum dipilih
        return { ...prev, size: [...prev.size, size] };
      }
    });
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    // Fetch product data
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${params.id}`);
        const product = res.data.data || res.data;
        // Handle size - bisa berupa array atau string yang dipisahkan koma
        let sizeArray = [];
        if (product.size) {
          if (Array.isArray(product.size)) {
            sizeArray = product.size;
          } else if (typeof product.size === 'string') {
            sizeArray = product.size.split(',').map(s => s.trim()).filter(s => s);
          }
        }
        
        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price || "",
          stock: product.stock || "",
          description: product.description || "",
          image: null,
          size: sizeArray,
        });
      } catch (err) {
        console.error("Gagal ambil produk:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi ukuran
    if (formData.size.length === 0) {
      alert("Pilih minimal satu ukuran produk");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu");
        router.push("/login");
        return;
      }

      // Debug: Log form data
      console.log("📝 Form Data:", {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        description: formData.description,
        size: formData.size,
        sizeLength: formData.size?.length,
        hasImage: !!formData.image,
      });

      // Prepare form data
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("category", formData.category);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);
      submitData.append("description", formData.description);
      
      // Append size array - Coba beberapa format untuk kompatibilitas Laravel
      if (Array.isArray(formData.size) && formData.size.length > 0) {
        // Method 1: Append sebagai size[] (Laravel standard)
        formData.size.forEach((size) => {
          submitData.append("size[]", size);
        });
        
        // Method 2: Juga kirim sebagai JSON string untuk backup
        submitData.append("size_json", JSON.stringify(formData.size));
        
        console.log("✅ Size array dikirim:", formData.size);
      } else {
        console.warn("⚠️ Size array kosong atau tidak valid:", formData.size);
        alert("Pilih minimal satu ukuran produk!");
        setSaving(false);
        return;
      }

      // Append image if exists
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Log FormData contents
      console.log("📦 FormData contents:");
      for (let pair of submitData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1]);
      }

      // IMPORTANT: Laravel method spoofing untuk PUT dengan FormData
      // Tambahkan _method=PUT untuk method spoofing
      submitData.append("_method", "PUT");

      // Send to API menggunakan POST dengan method spoofing
      // Jangan set Content-Type header, biarkan browser set otomatis untuk FormData
      const response = await api.post(`/products/${params.id}`, submitData, {
        headers: {
          // JANGAN set Content-Type untuk FormData, browser akan set otomatis dengan boundary
          "Authorization": `Bearer ${token}`,
        },
        timeout: 30000, // Increase timeout to 30 seconds
      });

      if (response.data.status) {
        alert("Produk berhasil diupdate!");
        router.push("/admin/produk");
      } else {
        throw new Error(response.data.message || "Gagal mengupdate produk");
      }
    } catch (error) {
      console.error("❌ Gagal update produk:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error config:", error.config);
      
      let errorMessage = "Gagal mengupdate produk";
      
      // Handle timeout error
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = "Request timeout! Backend tidak merespons. Pastikan backend Laravel sudah running:\n\ncd backend\nphp artisan serve";
      }
      // Handle network error
      else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = "Tidak bisa terhubung ke backend! Pastikan backend Laravel sudah running:\n\ncd backend\nphp artisan serve";
      }
      // Handle validation error
      else if (error.response?.status === 422) {
        const responseData = error.response.data;
        if (responseData?.errors && Object.keys(responseData.errors).length > 0) {
          const errors = responseData.errors;
          const errorDetails = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("\n");
          errorMessage = `Validasi gagal:\n${errorDetails}`;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else {
          errorMessage = "Validasi gagal! Periksa kembali data yang diinput.";
        }
      }
      // Handle other errors
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5a3921] mb-6">
            Edit Produk
          </h1>

          <form onSubmit={handleSubmit} className="rounded-lg shadow-md p-6 space-y-4" style={{ backgroundColor: "#F6F3EC" }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704d31] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Produk
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704d31] focus:border-transparent"
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="pria">Pakaian Pria</option>
                <option value="wanita">Pakaian Wanita</option>
                <option value="aksesoris">Aksesoris</option>
                <option value="kain">Kain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Produk
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704d31] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Produk
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704d31] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukuran Produk
              </label>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((size) => (
                  <label
                    key={size}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.size.includes(size)
                        ? "bg-[#704d31] text-white border-[#704d31]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#704d31]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.size.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="sr-only"
                    />
                    <span className="font-medium">{size}</span>
                  </label>
                ))}
              </div>
              {formData.size.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  Pilih minimal satu ukuran
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704d31] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704d31] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Gambar Saat Ini: (belum ada preview)</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#704d31] hover:bg-[#5a3921] text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {saving ? "Mengupdate..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/produk")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Kembali Ke Daftar Produk
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

