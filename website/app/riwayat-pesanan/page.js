"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Search, ChevronRight, CalendarCheck } from "lucide-react";
import { resolveImageUrl } from "../../lib/image";

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
    switch (status) {
      case "Pesanan Selesai":
        return "text-green-600 bg-green-50";
      case "Pesanan Dibatalkan":
        return "text-red-600 bg-red-50";
      case "Sedang Dikirim":
        return "text-blue-600 bg-blue-50";
      case "Sedang Diproses":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-[#7b4d2a] bg-[#fdf3ec]";
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar title="Riwayat Pesanan" showBack />

      <div className="luxury-container space-y-8 md:space-y-10">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[#c08a3e]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7b4d2a] to-[#c4986c] text-white shadow-lg">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#5c3316]">
                Riwayat Pesanan
              </h1>
              <p className="text-xs uppercase tracking-[0.4em] font-semibold">
                Jejak transaksi kamu
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c08a3e]"
            />
            <input
              type="text"
              placeholder="Cari ID atau nama produk"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input pl-12"
            />
          </div>
        </section>

        <section className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="glass-card rounded-[26px] border border-[#e3d6c5] bg-white/85 px-6 py-12 text-center text-[#5c3316]/70">
              Tidak ada pesanan ditemukan.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="glass-card rounded-[26px] border border-[#e3d6c5]/80 bg-white/80 px-5 py-5 shadow-[0_20px_60px_-45px_rgba(91,55,23,0.65)] transition hover:-translate-y-[1px]"
              >
                <div className="flex items-center justify-between border-b border-[#eadfd0] pb-4">
                  <div>
                    <p className="text-sm font-semibold text-[#5c3316]">{order.date}</p>
                    <p className="text-xs text-[#5c3316]/60 mt-1">ID: {order.id}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 py-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[#eadfd0] bg-white/70 shadow-inner md:h-24 md:w-24">
                        <img
                          src={resolveImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/logo_batik.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#5c3316]">{item.name}</h4>
                        <p className="text-xs text-[#5c3316]/60 mt-1">
                          Jumlah: {item.quantity} • Ukuran: {item.size}
                        </p>
                        <p className="text-sm font-semibold text-[#7b4d2a] mt-2">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[#eadfd0] pt-4">
                  <div>
                    <p className="text-xs text-[#5c3316]/60 uppercase tracking-[0.3em]">
                      Total
                    </p>
                    <p className="text-lg font-semibold text-[#7b4d2a]">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link
                    href={`/detail-pesanan/${order.id}`}
                    className="luxury-button text-xs"
                  >
                    Lihat detail
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

