"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Edit2, Wallet } from "lucide-react";
import { resolveImageUrl } from "../../lib/image";

export default function PembayaranPage() {
  const router = useRouter();
  const [pesanan, setPesanan] = useState([]);
  const [metode, setMetode] = useState("");
  const [bank, setBank] = useState("");
  const [ewallet, setEwallet] = useState("");
  const [shippingAddress, setShippingAddress] = useState(null);

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

    const savedAddress = localStorage.getItem("defaultAddress");
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error("Tidak dapat memuat defaultAddress:", error);
      }
    }

    const handleAddressUpdate = () => {
      const latest = localStorage.getItem("defaultAddress");
      if (latest) {
        try {
          setShippingAddress(JSON.parse(latest));
        } catch (error) {
          console.error("Tidak dapat memuat defaultAddress:", error);
        }
      } else {
        setShippingAddress(null);
      }
    };

    window.addEventListener("storage", handleAddressUpdate);
    window.addEventListener("defaultAddressUpdated", handleAddressUpdate);

    return () => {
      window.removeEventListener("storage", handleAddressUpdate);
      window.removeEventListener("defaultAddressUpdated", handleAddressUpdate);
    };
  }, []);

  useEffect(() => {
    setBank("");
    setEwallet("");
  }, [metode]);

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
    if (!shippingAddress) {
      alert("Tambahkan alamat pengiriman terlebih dahulu!");
      return;
    }

    // Simulate payment processing (always success for demo)
    const success = true;
    
    if (success) {
      // Generate order ID
      const orderId = `ORD${Date.now().toString().slice(-8)}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      
      // Calculate totals
      const subtotal = pesanan.reduce(
        (acc, item) => acc + (item.harga || item.price || 0) * (item.jumlah || 1),
        0
      );
      const tax = Math.round(subtotal * 0.1);
      const shipping = 20000;
      const total = subtotal + tax + shipping;

      // Create complete order object
      const newOrder = {
        id: orderId,
        date: dateStr,
        time: timeStr,
        status: "Sedang Diproses",
        items: pesanan.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.harga || item.price || 0,
          quantity: item.jumlah || 1,
          size: item.ukuran || item.size || "L",
          category: item.category || "Batik",
        })),
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod: metode,
        paymentBank: metode === "Transfer Bank" ? bank : ewallet,
        shippingAddress: shippingAddress,
      };

      // Save to order history
      const existingOrders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
      existingOrders.unshift(newOrder);
      localStorage.setItem("orderHistory", JSON.stringify(existingOrders));

      // Save last order for success page
      sessionStorage.setItem("lastOrder", JSON.stringify(pesanan));
      sessionStorage.setItem("lastOrderId", orderId);
      
      // Clear cart data
      localStorage.removeItem("checkoutData");
      
      // Remove items from cart
      const userDataRaw = localStorage.getItem("userData");
      let cartKey = "cartData";
      if (userDataRaw) {
        try {
          const userData = JSON.parse(userDataRaw);
          if (userData?.id) {
            cartKey = `cartData_${userData.id}`;
          }
        } catch (e) {}
      }
      const currentCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      const orderedIds = pesanan.map(item => `${item.id}||${item.ukuran || item.size || ""}`);
      const updatedCart = currentCart.filter(
        cartItem => !orderedIds.includes(`${cartItem.id}||${cartItem.ukuran || cartItem.size || ""}`)
      );
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

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
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar title="Pembayaran" showBack />

      <div className="luxury-container space-y-8 md:space-y-10">
        <section className="luxury-section space-y-4">
          <div className="flex items-center gap-3 text-[#c08a3e]">
            <Wallet size={22} />
            <span className="text-xs uppercase tracking-[0.4em] font-semibold">
              Ringkasan pesanan
            </span>
          </div>
          {pesanan.length === 0 ? (
            <p className="text-sm text-[#5c3316]/70">Tidak ada pesanan.</p>
          ) : (
            <div className="space-y-3">
              {pesanan.map((item) => (
                <div
                  key={`${item.id}-${item.ukuran || ""}`}
                  className="glass-card flex items-center gap-4 rounded-[22px] border border-[#e3d6c5]/70 bg-white/80 px-4 py-4"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[#eadfd0] bg-white/70 shadow-inner">
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
                    <h3 className="text-sm font-semibold text-[#5c3316]">{item.name}</h3>
                    <p className="text-xs text-[#5c3316]/60 mt-1">
                      Size: {item.ukuran || item.size || "-"} • Qty: {item.jumlah || 1}
                    </p>
                    <p className="text-sm font-semibold text-[#7b4d2a] mt-2">
                      Rp {((item.harga || item.price || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card rounded-[28px] border border-[#e3d6c5] bg-white/90 px-6 py-6 backdrop-blur-md md:px-8 md:py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#5c3316]">Alamat Pengiriman</h2>
            <button
              onClick={() => router.push("/alamat")}
              className="luxury-button text-xs"
            >
              <Edit2 size={16} />
              Ubah alamat
            </button>
          </div>
          {shippingAddress ? (
            <div className="rounded-2xl border border-[#e3d6c5] bg-[#fff6eb] px-4 py-4 text-sm text-[#5c3316]">
              <p className="font-semibold uppercase tracking-[0.3em]">
                {shippingAddress.label || "Alamat utama"}
              </p>
              <p className="mt-2 text-[#5c3316]/70">
                {shippingAddress.recipient_name} • {shippingAddress.recipient_phone}
              </p>
              <p className="mt-1 text-[#5c3316]/80">{shippingAddress.address}</p>
              <p className="mt-1 text-xs text-[#b08968] uppercase tracking-[0.2em]">
                {shippingAddress.district}, {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#5c3316]/70">
              Belum ada alamat default. Tambahkan alamat di menu profil untuk melanjutkan pembayaran.
            </p>
          )}
        </section>

        <section className="glass-card rounded-[28px] border border-[#e3d6c5] bg-white/90 px-6 py-6 backdrop-blur-md md:px-8 md:py-8 space-y-5">
          <h2 className="text-lg font-semibold text-[#5c3316]">Metode Pembayaran</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {["Transfer Bank", "Dompet Digital"].map((m) => (
              <button
                key={m}
                onClick={() => setMetode(m)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  metode === m
                    ? "border-[#7b4d2a] bg-gradient-to-br from-[#fdf3ec] to-[#fff7ef] text-[#5c3316]"
                    : "border-[#e3d6c5] bg-white/70 text-[#5c3316] hover:bg-[#fefaf6]"
                }`}
              >
                {m}
                <span
                  className={`h-4 w-4 rounded-full border ${
                    metode === m ? "border-transparent bg-[#7b4d2a]" : "border-[#d1b799]"
                  }`}
                />
              </button>
            ))}
          </div>

          {metode === "Transfer Bank" && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {bankOptions.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setBank(b.name)}
                  className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${
                    bank === b.name
                      ? "border-[#7b4d2a] bg-[#7b4d2a] text-white"
                      : "border-[#e3d6c5] bg-white/70 text-[#5c3316] hover:bg-[#fefaf6]"
                  }`}
                >
                  <Image src={b.logo} alt={b.name} width={28} height={28} className="rounded" />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          )}

          {metode === "Dompet Digital" && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {ewalletOptions.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => setEwallet(wallet.name)}
                  className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${
                    ewallet === wallet.name
                      ? "border-[#7b4d2a] bg-[#7b4d2a] text-white"
                      : "border-[#e3d6c5] bg-white/70 text-[#5c3316] hover:bg-[#fefaf6]"
                  }`}
                >
                  <Image src={wallet.logo} alt={wallet.name} width={28} height={28} className="rounded" />
                  <span>{wallet.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card rounded-[28px] border border-[#e3d6c5] bg-white/90 px-6 py-6 backdrop-blur-md md:px-8 md:py-8">
          <h2 className="text-lg font-semibold text-[#5c3316]">Total Pembayaran</h2>
          <div className="mt-4 space-y-2 text-sm text-[#5c3316]">
            <div className="flex items-center justify-between">
              <span>Total harga</span>
              <span className="font-semibold text-[#7b4d2a]">
                Rp {totalHarga.toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-xs text-[#5c3316]/60">{pesanan.length} item</p>
          </div>
        </section>

        <button
          onClick={handleKonfirmasi}
          className="luxury-button primary-button w-full justify-center text-lg"
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
}
