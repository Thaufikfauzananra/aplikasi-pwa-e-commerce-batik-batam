"use client";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Login success:", response.data);
      alert("Login berhasil! Selamat datang di Batik Cindur Batam 🌸");
      // TODO: Redirect ke dashboard nanti
    } catch (error) {
      console.error("❌ Login gagal:", error.response?.data || error.message);
      alert("Login gagal! Periksa kembali email dan kata sandi kamu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fefaf6] to-[#f8f4ef] px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 transition-all">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo_batik.jpg" 
            alt="Batik Cindur Batam"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Teks Selamat Datang */}
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-[#5a3921] mb-6">
          Selamat Datang
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="flex items-center border border-[#b08968] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50">
            <span className="material-icons text-[#b08968] mr-2">person</span>
            <input
              type="email"
              placeholder="Nama Pengguna"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-[#b08968] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50">
            <span className="material-icons text-[#b08968] mr-2">lock</span>
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            className="w-full bg-[#5a3921] hover:bg-[#704d31] text-white py-2 rounded-md transition-all text-sm sm:text-base"
          >
            Masuk
          </button>

          {/* Link ke Register */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-3">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-[#5a3921] font-medium hover:underline"
            >
              Daftar Sekarang
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
