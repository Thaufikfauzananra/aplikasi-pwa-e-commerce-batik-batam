"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../../../components/AdminSidebar";
import api from "../../../../lib/axios";

export default function TambahProduk() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi ukuran
    if (formData.size.length === 0) {
      alert("Pilih minimal satu ukuran produk");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu");
        router.push("/login");
        return;
      }

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
      } else {
        alert("Pilih minimal satu ukuran produk!");
        setLoading(false);
        return;
      }

      // Append image if exists
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Send to API
      const response = await api.post("/products", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        alert("Produk berhasil ditambahkan!");
        // Trigger event untuk refresh halaman lain
        window.dispatchEvent(new Event('productsUpdated'));
        router.push("/admin/produk");
      } else {
        throw new Error(response.data.message || "Gagal menambahkan produk");
      }
    } catch (error) {
      console.error("Gagal tambah produk:", error);
      let errorMessage = "Gagal menambahkan produk";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F6F3EC" }}>
      <AdminSidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen" style={{ backgroundColor: "#F6F3EC" }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5a3921] mb-6">
            Tambah Produk
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
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#704d31] hover:bg-[#5a3921] text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/produk")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

