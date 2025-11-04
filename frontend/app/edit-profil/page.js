"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Save, Edit2 } from "lucide-react";

export default function EditProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    gender: "",
    avatar: "/logo_batik.jpg",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        name: parsed.name || "",
        username: parsed.username || parsed.name || "",
        phone: parsed.phone || "",
        email: parsed.email || "",
        gender: parsed.gender || "",
        avatar: parsed.avatar || "/logo_batik.jpg",
      });
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUser({ ...user, avatar: imageURL });
    }
  };

  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(user));
    alert("Profil berhasil diperbarui ✅");
    router.push("/profil");
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar showBack={true} />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-[#e7d9c6]">
              <Image
                src={user.avatar}
                alt="Foto Profil"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-0 right-0 bg-[#704d31] text-white rounded-full p-2 shadow-md hover:bg-[#5a3921] transition cursor-pointer"
            >
              <Edit2 size={16} />
            </label>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-6 md:p-8 space-y-5 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-[#5a3921] mb-2">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border border-[#b08968] rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5a3921] mb-2">
              Nama Pengguna
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full border border-[#b08968] rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
              placeholder="Masukkan nama pengguna"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5a3921] mb-2">
              No. HP
            </label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full border border-[#b08968] rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
              placeholder="Masukkan nomor HP"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5a3921] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-[#b08968] rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
              placeholder="Masukkan email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#5a3921] mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="w-full border border-[#b08968] rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#b08968]/50 bg-white text-[#5a3921]"
            >
              <option value="">Pilih Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-[#704d31] hover:bg-[#5a3921] text-white py-3 md:py-4 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-6"
          >
            <Save size={20} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
