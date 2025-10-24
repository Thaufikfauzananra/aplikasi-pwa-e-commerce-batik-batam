"use client";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ untuk toggle password
  const [showConfirm, setShowConfirm] = useState(false); // 👁️ untuk toggle konfirmasi

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Kamu harus menyetujui syarat & ketentuan dulu");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Register success:", response.data);
      alert("Registrasi berhasil! Silakan login.");
    } catch (error) {
      console.error("❌ Register gagal:", error.response?.data || error.message);
      alert("Registrasi gagal! Cek kembali data kamu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fefaf6] to-[#f8f4ef] px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 transition-all">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo_batik.jpg"
            alt="Batik Cindur Batam"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Judul */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#5a3921] mb-6">
          Daftar Akun Baru
        </h2>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nama */}
          <div className="flex items-center border border-[#b08968] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50">
            <span className="material-icons text-[#b08968] mr-2">person</span>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-[#b08968] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50">
            <span className="material-icons text-[#b08968] mr-2">email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-[#b08968] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 relative">
            <span className="material-icons text-[#b08968] mr-2">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm sm:text-base pr-8"
            />
            <div
              className="absolute right-3 cursor-pointer text-[#b08968] hover:text-[#5a3921]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="flex items-center border border-[#b08968] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 relative">
            <span className="material-icons text-[#b08968] mr-2">lock</span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full outline-none bg-transparent text-sm sm:text-base pr-8"
            />
            <div
              className="absolute right-3 cursor-pointer text-[#b08968] hover:text-[#5a3921]"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start sm:items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 sm:mt-0"
            />
            <label className="text-sm text-gray-600 leading-tight">
              Saya menyetujui{" "}
              <span className="font-medium text-[#5a3921]">
                Syarat & Ketentuan
              </span>
            </label>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full bg-[#5a3921] hover:bg-[#704d31] text-white py-2 rounded-md transition-all text-sm sm:text-base"
          >
            Daftar
          </button>

          {/* Link Login */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-[#5a3921] font-medium hover:underline"
            >
              Masuk di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
