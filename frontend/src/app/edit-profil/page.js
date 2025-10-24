"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProfilPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    avatar: "/alfi.jpg",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");

    if (savedUser) {
      const parsed = JSON.parse(savedUser);

      if (
        parsed.name.includes("alfi") ||
        parsed.email.includes("sayhrin")
      ) {
        const newData = {
          name: "Nur Alfi Syahrin",
          email: "alfiyu@email.com",
          address: "Perumahan Buana Impian 1, Batam",
          avatar: "/alfi.jpg",
        };
        localStorage.setItem("userData", JSON.stringify(newData));
        setUser(newData);
      } else {
        setUser(parsed);
      }
    } else {
      // kalau belum ada data, set default Alfiyu 💕
      const defaultUser = {
        name: "Nur Alfi Syahrin",
        email: "alfiyu@email.com",
        address: "Perumahan Buana Impian 1, Batam",
        avatar: "/alfi.jpg",
      };
      setUser(defaultUser);
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
    window.location.href = "/profil";
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] text-[#5a3921] pb-10">
      {/* 🔝 Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#e7d9c6] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/profil">
            <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-[#704d31]" />
          </Link>
          <h1 className="text-lg font-semibold">Edit Profil</h1>
        </div>
      </header>

      {/* 👩🏻‍💼 Foto Profil */}
      <section className="flex flex-col items-center mt-8">
        <div className="relative">
          <Image
            src={user.avatar}
            alt="Foto Profil Alfiyu"
            width={100}
            height={100}
            className="rounded-full border-2 border-[#e7d9c6] object-cover w-24 h-24"
          />
          <label
            htmlFor="avatarUpload"
            className="absolute bottom-0 right-0 bg-[#704d31] text-white rounded-full p-1 cursor-pointer text-xs hover:bg-[#5a3921]"
          >
            ✎
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </section>

      {/* ✏️ Form Edit Profil */}
      <section className="mt-8 px-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border border-[#e7d9c6] rounded-lg px-4 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#b08968] bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border border-[#e7d9c6] rounded-lg px-4 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#b08968] bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleChange}
            rows="3"
            className="w-full border border-[#e7d9c6] rounded-lg px-4 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#b08968] bg-white resize-none"
          ></textarea>
        </div>

        {/* 💾 Tombol Simpan */}
        <button
          onClick={handleSave}
          className="w-full bg-[#704d31] text-white py-3 rounded-lg font-medium 
                     hover:bg-[#5a3921] transition flex justify-center items-center gap-2"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </section>
    </div>
  );
}
