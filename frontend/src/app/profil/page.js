"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios"; 
import {
  ArrowLeft,
  User,
  Clock,
  MapPin,
  Settings,
  LogOut,
  Heart,
  Home,            // ✅ Tambahkan ini
  Folder,
  ShoppingCart,    // ✅ Tambahkan juga kalau belum ada
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function ProfilPage() {
  const [user, setUser] = useState({
    name: "Nur Alfi Syahrin",
    email: "alfiyu@email.com",
    address: "Perumahan Buana Impian 1, Batam",
    avatar: "/alfi.jpg",
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    alert("Kamu telah keluar dari akun ✅");
    router.push("/login");
  };

  const menuItems = [
    {
      icon: <User size={18} />,
      title: "Edit Profil",
      link: "/edit-profil",
    },
    {
      icon: <Clock size={18} />,
      title: "Riwayat Pesanan",
      link: "/riwayat-pesanan",
    },
    {
      icon: <MapPin size={18} />,
      title: "Alamat",
      link: "/alamat",
      subtitle: user.address,
    },
    {
      icon: <Settings size={18} />,
      title: "Pengaturan",
      link: "/pengaturan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefaf6] text-[#5a3921] pb-24">
      {/* 🔝 Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-[#e7d9c6] bg-white sticky top-0 z-50">
        <Link href="/BerandaPembeli">
          <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
        </Link>
        <h1 className="text-lg font-semibold text-[#5a3921]">Profil</h1>
      </header>

      {/* 👤 Profil Info */}
      <section className="flex flex-col items-center mt-8 text-center">
        <div className="w-24 h-24 relative">
          <Image
            src={user.avatar || "/user-avatar.png"}
            alt="Foto Profil"
            fill
            className="rounded-full object-cover border-2 border-[#e7d9c6]"
          />
        </div>
        <h2 className="mt-3 font-semibold text-lg">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </section>

      {/* 📋 Menu Akun */}
      <section className="mt-8 px-6">
        <h3 className="text-sm font-semibold text-[#704d31] mb-3">Akun</h3>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="flex items-center justify-between bg-white border border-[#e7d9c6]/70 rounded-lg px-4 py-3 shadow-sm hover:bg-[#fdf3ec] transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fefaf6] rounded-lg text-[#704d31]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 truncate w-44">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🚪 Tombol Keluar */}
      <div className="mt-10 px-6">
        <button
          onClick={handleLogout}
          className="w-full bg-[#704d31] text-white py-3 rounded-lg font-medium hover:bg-[#5a3921] transition flex justify-center items-center gap-2"
        >
          <LogOut size={18} /> Keluar
        </button>
      </div>

      {/* 🧭 Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fefaf6] border-t border-[#d6c2aa] shadow-sm flex justify-around py-2 z-50">
        {[
          { name: "Beranda", icon: Home, href: "/BerandaPembeli" },
          { name: "Kategori", icon: Folder, href: "/kategori_pembeli" },
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
              className={`flex flex-col items-center text-center text-xs font-medium transition-transform ${
                isActive
                  ? "scale-110 text-[#704d31]"
                  : "text-[#b08968] hover:scale-105"
              }`}
            >
              <Icon
                size={22}
                className={`${
                  isActive ? "text-[#704d31]" : "text-[#b08968]"
                } transition-colors duration-200`}
              />
              <span
                className={`mt-1 ${
                  isActive ? "text-[#704d31]" : "text-[#b08968]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
