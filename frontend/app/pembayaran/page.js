"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { ArrowLeft, Edit2 } from "lucide-react";

export default function PembayaranPage() {
  const router = useRouter();
  const [pesanan, setPesanan] = useState([]);
  const [alamat, setAlamat] = useState("Jl. Diponegoro No. 10, Batam");
  const [editAlamat, setEditAlamat] = useState(false);
  const [metode, setMetode] = useState("");
  const [bank, setBank] = useState("");
  const [ewallet, setEwallet] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) {
      setPesanan(JSON.parse(data));
    } else {
      router.push("/keranjang");
    }
    
    const savedPayment = localStorage.getItem("paymentMethod");
    if (savedPayment) {
      setMetode(savedPayment === "transfer" ? "Transfer Bank" : "Dompet Digital");
    }
  }, []);

  const totalHarga = pesanan.reduce(
    (acc, item) => acc + (item.harga || item.price || 0) * (item.jumlah || 1),
    0
  );

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

    // Simulate payment processing
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      localStorage.removeItem("checkoutData");
      router.push("/pembayaran-berhasil");
    } else {
      router.push("/pembayaran-gagal");
    }
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
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-6">
      <Navbar title="Pembayaran" showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-4">
          <h2 className="font-semibold text-[#704d31] mb-4 text-lg">Ringkasan Pesanan</h2>
          {pesanan.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada pesanan.</p>
          ) : (
            <div className="space-y-3">
              {pesanan.map((item) => (
                <div
                  key={`${item.id}-${item.ukuran || ''}`}
                  className="flex items-center gap-4 border-b border-[#f1e3d4] pb-3 last:border-0"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/logo_batik.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-[#5a3921]">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      Size: {item.ukuran || item.size || "-"}, Qty: {item.jumlah || 1}
                    </p>
                    <p className="text-[#704d31] text-sm font-semibold">
                      Rp {((item.harga || item.price || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-4">
          <h2 className="font-semibold text-[#704d31] mb-3 text-lg">Alamat Pengiriman</h2>
          <div className="bg-[#fefaf6] border border-[#e7d9c6] rounded-lg p-3 flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-sm text-[#5a3921]">Rumah</p>
              {editAlamat ? (
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full mt-2 p-2 text-sm border border-[#b08968] rounded-md outline-none focus:ring-2 focus:ring-[#b08968]/50"
                  rows="3"
                />
              ) : (
                <p className="text-xs text-gray-600 mt-1">{alamat}</p>
              )}
            </div>
            <button
              onClick={() => setEditAlamat(!editAlamat)}
              className="text-[#704d31] hover:text-[#5a3921] ml-3"
            >
              <Edit2 size={18} />
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-4">
          <h2 className="font-semibold text-[#704d31] mb-4 text-lg">Metode Pembayaran</h2>
          <div className="space-y-3 mb-4">
            {["Transfer Bank", "Dompet Digital"].map((m) => (
              <label
                key={m}
                onClick={() => setMetode(m)}
                className={`flex justify-between items-center border rounded-lg py-3 px-4 cursor-pointer transition ${
                  metode === m
                    ? "border-[#704d31] bg-[#fdf3ec]"
                    : "border-[#e7d9c6] hover:bg-[#fefaf6]"
                }`}
              >
                <span className="text-[#5a3921] font-medium">{m}</span>
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

          {/* Bank Options */}
          {metode === "Transfer Bank" && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {bankOptions.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setBank(b.name)}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition ${
                    bank === b.name
                      ? "bg-[#704d31] text-white border-[#704d31]"
                      : "border-[#d6c2aa] hover:bg-[#fdf3ec] text-[#5a3921]"
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

          {/* E-Wallet Options */}
          {metode === "Dompet Digital" && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {ewalletOptions.map((e) => (
                <button
                  key={e.name}
                  onClick={() => setEwallet(e.name)}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition ${
                    ewallet === e.name
                      ? "bg-[#704d31] text-white border-[#704d31]"
                      : "border-[#d6c2aa] hover:bg-[#fdf3ec] text-[#5a3921]"
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
        </div>

        {/* Total Payment */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-6">
          <h2 className="font-semibold text-[#704d31] mb-3 text-lg">Total Pembayaran</h2>
          <div className="bg-[#fefaf6] border border-[#e7d9c6] rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2 text-[#5a3921]">
              <span>Total Harga</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{pesanan.length} item</span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleKonfirmasi}
          className="w-full bg-[#704d31] hover:bg-[#5a3921] text-white py-4 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
}
