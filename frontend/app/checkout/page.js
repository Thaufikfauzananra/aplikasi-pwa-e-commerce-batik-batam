"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Edit2, ChevronRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    name: "Julie Sri",
    address: "Jln. Merdeka No. 123, Batam",
  });
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      router.push("/keranjang");
    }
    
    const savedPayment = localStorage.getItem("paymentMethod");
    if (savedPayment) {
      setPaymentMethod(savedPayment === "transfer" ? "Transfer Bank" : "Dompet Digital");
    }
  }, []);

  const subtotal = checkoutData.reduce(
    (acc, item) => acc + Number(item.harga || item.price || 0) * (item.jumlah || 1),
    0
  );
  const shipping = 20000;
  const total = subtotal + shipping;

  const handlePay = () => {
    router.push("/pembayaran");
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-6">
      <Navbar title="Checkout" showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-[#5a3921] text-lg">Alamat pengiriman</h3>
            <Link
              href="/profil"
              className="text-[#704d31] hover:text-[#5a3921] text-sm font-medium flex items-center gap-1"
            >
              Ubah
              <Edit2 size={14} />
            </Link>
          </div>
          <p className="text-[#5a3921] font-medium">{shippingAddress.name}</p>
          <p className="text-sm text-gray-600 mt-1">{shippingAddress.address}</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-4">
          <h3 className="font-semibold text-[#5a3921] text-lg mb-4">Pesanan</h3>
          <div className="space-y-4">
            {checkoutData.map((item) => (
              <div key={`${item.id}-${item.ukuran || ''}`} className="flex gap-4 pb-4 border-b border-[#e7d9c6] last:border-0 last:pb-0">
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
                  <p className="text-sm text-gray-600 mb-2">
                    Ukuran: {item.ukuran || item.size || "L"} | Qty: {item.jumlah || 1}
                  </p>
                  <p className="text-[#704d31] font-bold">
                    Rp {(Number(item.harga || item.price || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                  </p>
                </div>
                <Link
                  href={`/detail_produk/${item.id}`}
                  className="text-[#704d31] hover:text-[#5a3921] text-sm flex items-center gap-1 self-start"
                >
                  Lihat Detail
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-4">
          <h3 className="font-semibold text-[#5a3921] text-lg mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-[#5a3921]">
              <span>Subtotal:</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-[#5a3921]">
              <span>Ongkos Kirim:</span>
              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-[#e7d9c6] pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-[#704d31]">
                <span>Total Pembayaran:</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-4 md:p-6 mb-6">
          <h3 className="font-semibold text-[#5a3921] text-lg mb-3">Metode Pembayaran</h3>
          <div className="flex items-center justify-between p-3 bg-[#fefaf6] rounded-lg border border-[#e7d9c6]">
            <span className="font-medium text-[#5a3921]">{paymentMethod}</span>
            <Link
              href="/keranjang"
              className="text-[#704d31] hover:text-[#5a3921]"
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="w-full bg-[#704d31] hover:bg-[#5a3921] text-white py-4 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
