"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { User, Bell, MapPin, Lock, LogOut, ChevronRight, Edit2 } from "lucide-react";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Nama Pengguna",
    email: "user@email.com",
    avatar: "/logo_batik.jpg",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Check if logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("cartData");
    alert("Anda telah keluar dari akun");
    router.push("/login");
  };

  const menuItems = [
    {
      icon: User,
      title: "Edit Profil",
      link: "/edit-profil",
    },
    {
      icon: Bell,
      title: "Notifikasi",
      link: "/notifikasi",
    },
    {
      icon: MapPin,
      title: "Alamat Pengiriman",
      link: "/alamat",
    },
    {
      icon: Lock,
      title: "Ganti Password",
      link: "/ganti-password",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-[#e7d9c6]">
              <Image
                src={user.avatar || "/logo_batik.jpg"}
                alt="Foto Profil"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              onClick={() => router.push("/edit-profil")}
              className="absolute bottom-0 right-0 bg-[#704d31] text-white rounded-full p-2 shadow-md hover:bg-[#5a3921] transition"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#5a3921]">
            {user.name || "Nama Pengguna"}
          </h2>
        </div>

        {/* Menu List */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.link}
                className="flex items-center justify-between bg-white rounded-xl border border-[#e7d9c6] p-4 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#fefaf6] rounded-lg text-[#704d31] group-hover:bg-[#fdf3ec] transition">
                    <Icon size={20} />
                  </div>
                  <span className="font-medium text-[#5a3921]">{item.title}</span>
                </div>
                <ChevronRight size={20} className="text-[#b08968] group-hover:text-[#704d31] transition" />
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#704d31] hover:bg-[#5a3921] text-white py-4 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
