"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Search, ChevronRight } from "lucide-react";

export default function RiwayatPesananPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load order history from localStorage or API
    const savedOrders = localStorage.getItem("orderHistory");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Sample data
      const sampleOrders = [
        {
          id: "ORD001",
          date: "29 Sep",
          status: "Pesanan Selesai",
          items: [
            {
              id: 1,
              name: "Blus Pesona Cindur",
              image: "/wanita1.jpg",
              price: 249000,
              quantity: 1,
              size: "L",
            },
          ],
          total: 249000,
        },
        {
          id: "ORD002",
          date: "28 Sep",
          status: "Pesanan Dibatalkan",
          items: [
            {
              id: 2,
              name: "Kemeja Batik Lengan Pendek",
              image: "/pria1.jpg",
              price: 299000,
              quantity: 2,
              size: "M",
            },
          ],
          total: 598000,
        },
      ];
      setOrders(sampleOrders);
      localStorage.setItem("orderHistory", JSON.stringify(sampleOrders));
    }
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchLower)
      )
    );
  });

  const getStatusColor = (status) => {
    if (status === "Pesanan Selesai") {
      return "text-green-600 bg-green-50";
    } else if (status === "Pesanan Dibatalkan") {
      return "text-red-600 bg-red-50";
    }
    return "text-blue-600 bg-blue-50";
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar title="Riwayat Pesanan" showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b08968]" size={20} />
            <input
              type="text"
              placeholder="Cari Pesanan Anda"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#b08968] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
            />
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada pesanan ditemukan.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#e7d9c6]">
                  <div>
                    <p className="text-sm text-gray-600">{order.date}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {order.id}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/logo_batik.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#5a3921] mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Jumlah: {item.quantity} | Ukuran: {item.size}
                        </p>
                        <p className="text-[#704d31] font-bold">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total & Action */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e7d9c6]">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-[#704d31]">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link
                    href={`/detail-pesanan/${order.id}`}
                    className="flex items-center gap-2 text-[#704d31] hover:text-[#5a3921] font-medium text-sm"
                  >
                    Lihat Detail
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

