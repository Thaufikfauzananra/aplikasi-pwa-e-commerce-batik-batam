"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { User, Bell, MapPin, Lock, LogOut, ChevronRight, Edit2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-transparent pb-24 md:pb-0">
      <Navbar showBack />

      <div className="luxury-container space-y-8 md:space-y-10">
        <section className="luxury-section flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[#e3d6c5] bg-white/80 shadow-[0_20px_60px_-40px_rgba(91,55,23,0.75)] md:mx-0 md:h-32 md:w-32">
            <Image
              src={user.avatar || "/logo_batik.jpg"}
              alt="Foto Profil"
              fill
              className="object-cover"
            />
            <button
              onClick={() => router.push("/edit-profil")}
              className="group absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-[#7b4d2a] text-white shadow-lg transition hover:translate-y-[1px]"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <div className="space-y-2">
            <span className="floating-badge bg-white/70 border-white/60 text-[#7b4d2a]">
              Akun eksklusif
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#5c3316]">
              {user.name || "Nama Pengguna"}
            </h2>
            <p className="text-sm text-[#5c3316]/70">
              Kelola profilmu, atur notifikasi, dan simpan alamat favorit untuk pengalaman berbelanja yang mulus.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#c08a3e]">
            <Sparkles size={18} />
            <span className="text-xs uppercase tracking-[0.4em] font-semibold">
              Pengaturan utama
            </span>
          </div>
          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className="glass-card flex items-center justify-between rounded-[26px] border border-[#e3d6c5]/80 bg-white/80 px-5 py-4 transition hover:-translate-y-[1px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdf3ec] text-[#7b4d2a]">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-[#5c3316]">{item.title}</span>
                  </div>
                  <ChevronRight size={20} className="text-[#c08a3e]" />
                </Link>
              );
            })}
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="luxury-button primary-button flex w-full items-center justify-center gap-2 text-base"
        >
          <LogOut size={18} />
          <span>Keluar dari akun</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
