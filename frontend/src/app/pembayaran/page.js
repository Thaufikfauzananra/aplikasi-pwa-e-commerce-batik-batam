"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Home,
  Folder,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function PembayaranPage() {
  const pathname = usePathname();

  const [pesanan, setPesanan] = useState([]);
  const [alamat, setAlamat] = useState("Jl. Diponegoro No. 10, Batam");
  const [editAlamat, setEditAlamat] = useState(false);
  const [metode, setMetode] = useState("");
  const [bank, setBank] = useState("");
  const [ewallet, setEwallet] = useState("");

  // 🔁 ambil data checkout dari keranjang
  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) setPesanan(JSON.parse(data));
  }, []);

  const totalHarga = pesanan.reduce(
    (acc, item) => acc + item.harga * (item.jumlah || 1),
    0
  );

  // 🚀 tombol konfirmasi pembayaran (simulasi Midtrans)
  const handleKonfirmasi = async () => {
    if (!metode) {
      alert("Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }
    if (metode === "Transfer Bank" && !bank) {
      alert("Pilih bank terlebih dahulu!");
      return;
    }
    if (metode === "Dompet Digital" && !ewallet) {
      alert("Pilih dompet digital terlebih dahulu!");
      return;
    }

    // nanti diganti panggil Midtrans Snap
    // window.snap.pay(snapToken);

    localStorage.removeItem("checkoutData");
    window.location.href = "/pembayaran-berhasil";
  };

  const bankOptions = [
    { name: "BCA", logo: "/BCA.jpg" },
    { name: "BNI", logo: "/bni.png" },
    { name: "BRI", logo: "/briii.png" },
    { name: "Mandiri", logo: "/mandiri.png" },
    { name: "Permata", logo: "/Permata.png" },
  ];

  const ewalletOptions = [
    { name: "GoPay", logo: "/gopayy.png" },
    { name: "OVO", logo: "/ovoo.jpg" },
    { name: "Dana", logo: "/danaa.png" },
    { name: "ShopeePay", logo: "/shopeepayy.png" },
  ];

  return (
    <>
      <div className="min-h-screen bg-white text-[#5a3921] pb-28">
        {/* 🔝 Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/keranjang">
              <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
            </Link>
            <h1 className="text-lg font-semibold">Pembayaran</h1>
          </div>
        </header>

        {/* 🧾 Ringkasan Pesanan */}
        <section className="px-6 mt-5">
          <h2 className="font-semibold text-[#704d31] mb-3">Ringkasan Pesanan</h2>
          {pesanan.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada pesanan.</p>
          ) : (
            pesanan.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-[#f1e3d4] pb-3 mb-3"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600">
                    Size: {item.ukuran || "-"}, Stok: {item.stok || 1}
                  </p>
                  <p className="text-[#704d31] text-sm font-semibold">
                    Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500">Batik Cindur Batam</p>
                </div>
              </div>
            ))
          )}
        </section>

        {/* 📍 Alamat Pengiriman */}
        <section className="px-6 mt-6">
          <h2 className="font-semibold text-[#704d31] mb-2">Alamat Pengiriman</h2>
          <div className="bg-[#fefaf6] border border-[#e7d9c6]/70 rounded-lg p-3 flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-sm">Rumah</p>
              {editAlamat ? (
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full mt-2 p-2 text-sm border border-[#b08968] rounded-md outline-none"
                />
              ) : (
                <p className="text-xs text-gray-600 mt-1">{alamat}</p>
              )}
            </div>
            <button
              onClick={() => setEditAlamat(!editAlamat)}
              className="text-[#704d31] hover:text-[#5a3921]"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </section>

        {/* 💳 Metode Pembayaran */}
        <section className="px-6 mt-6">
          <h2 className="font-semibold text-[#704d31] mb-2">Metode Pembayaran</h2>
          <div className="space-y-3">
            {["Transfer Bank", "Dompet Digital"].map((m) => (
              <label
                key={m}
                onClick={() => setMetode(m)}
                className={`flex justify-between items-center border rounded-lg py-3 px-4 text-sm cursor-pointer transition ${
                  metode === m
                    ? "border-[#704d31] bg-[#fdf3ec]"
                    : "border-[#e7d9c6] hover:bg-[#fefaf6]"
                }`}
              >
                {m}
                <input
                  type="radio"
                  name="metode"
                  checked={metode === m}
                  onChange={() => setMetode(m)}
                  className="accent-[#704d31]"
                />
              </label>
            ))}
          </div>

          {/* 🏦 Opsi Bank */}
          {metode === "Transfer Bank" && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {bankOptions.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setBank(b.name)}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition ${
                    bank === b.name
                      ? "bg-[#704d31] text-white border-[#704d31]"
                      : "border-[#d6c2aa] hover:bg-[#fdf3ec]"
                  }`}
                >
                  <Image
                    src={b.logo}
                    alt={b.name}
                    width={28}
                    height={28}
                    className="rounded"
                  />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* 💰 Opsi Dompet Digital */}
          {metode === "Dompet Digital" && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {ewalletOptions.map((e) => (
                <button
                  key={e.name}
                  onClick={() => setEwallet(e.name)}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition ${
                    ewallet === e.name
                      ? "bg-[#704d31] text-white border-[#704d31]"
                      : "border-[#d6c2aa] hover:bg-[#fdf3ec]"
                  }`}
                >
                  <Image
                    src={e.logo}
                    alt={e.name}
                    width={28}
                    height={28}
                    className="rounded"
                  />
                  <span>{e.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 🧾 Total Pembayaran */}
        <section className="px-6 mt-6 mb-28">
          <h2 className="font-semibold text-[#704d31] mb-2">Total Pembayaran</h2>
          <div className="bg-[#fefaf6] border border-[#e7d9c6]/70 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Total Harga</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{pesanan.length} item</span>
            </div>
          </div>
        </section>

        {/* 🟤 Tombol Konfirmasi */}
        <div className="fixed bottom-14 left-0 right-0 px-6 py-4 bg-white border-t border-[#d6c2aa]">
          <button
            onClick={handleKonfirmasi}
            className="w-full bg-[#704d31] text-white py-3 rounded-lg font-medium hover:bg-[#5a3921] transition"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>

      {/* 🧭 Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fefaf6] border-t border-[#d6c2aa] shadow-sm flex justify-around py-2 z-50">
        {[
          { name: "Beranda", icon: Home, href: "/BerandaPembeli" },
          { name: "Kategori", icon: Folder, href: "/kategori" },
          { name: "Wishlist", icon: Heart, href: "/wishlist" },
          { name: "Keranjang", icon: ShoppingCart, href: "/keranjang" },
          { name: "Profil", icon: User, href: "/profil" },
        ].map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center text-center text-xs font-medium ${
                isActive
                  ? "text-[#704d31] scale-105"
                  : "text-[#b08968] hover:scale-105"
              }`}
            >
              <Icon size={22} />
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
