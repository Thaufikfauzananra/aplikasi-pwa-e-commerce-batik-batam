"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";

export default function AdminPesanan() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    // Fetch orders (nanti bisa dari API)
    setOrders([]);
    setLoading(false);
  }, [router]);

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
          <h1 className="text-2xl md:text-3xl font-bold text-[#5a3921] mb-6">
            Pesanan
          </h1>

          <div className="rounded-lg shadow-md overflow-x-auto" style={{ backgroundColor: "#F6F3EC" }}>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Pembeli</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No HP</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alamat</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gambar</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Harga</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jumlah</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500 bg-white">
                      Belum ada pesanan
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.id} className="border-t border-gray-200 bg-white">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{order.buyer_name}</td>
                      <td className="px-4 py-3">{order.phone}</td>
                      <td className="px-4 py-3">{order.address}</td>
                      <td className="px-4 py-3">{order.product_name}</td>
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 bg-white rounded overflow-hidden">
                          {order.image && (
                            <img src={order.image} alt={order.product_name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">Rp {order.price?.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3">Rp {order.total?.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline text-sm">Detail</button>
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

