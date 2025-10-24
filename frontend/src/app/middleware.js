"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";

export default function BerandaPembeli() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 cek apakah sudah login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      getProducts();
    }
  }, []);

  // 🔄 ambil data produk dari backend
  const getProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <p className="p-5 text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#f9f7f3] p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-[#5B4636]">Beranda Pembeli</h1>
        <button onClick={handleLogout} className="text-red-600 text-sm">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p className="text-gray-500">Belum ada produk.</p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-3 rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={p.image || "/images/default.jpg"}
                alt={p.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="font-medium mt-2">{p.name}</h3>
              <p className="text-sm text-gray-600">
                Rp {Number(p.price).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
