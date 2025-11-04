"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import api from "../../lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      console.log("✅ Register success:", response.data);
      
      // Jika backend langsung return token setelah register, langsung login
      if (response.data.token || response.data.access_token) {
        const token = response.data.token || response.data.access_token;
        localStorage.setItem("token", token);
        
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }
        
        // Save role (register selalu jadi user)
        if (response.data.role) {
          localStorage.setItem("userRole", response.data.role);
        } else {
          localStorage.setItem("userRole", "user"); // Default user
        }
        
        // Register selalu redirect ke Beranda (karena selalu user)
        alert("Registrasi berhasil! Mengarahkan ke halaman utama...");
        router.push("/Beranda");
      } else {
        // Jika tidak ada token, redirect ke login
        alert("Registrasi berhasil! Silakan login.");
        router.push("/login");
      }
    } catch (error) {
      console.error("❌ Register gagal:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors 
        ? JSON.stringify(error.response.data.errors || error.response.data.message)
        : "Registrasi gagal! Cek kembali data kamu.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefaf6]">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 md:py-12">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 md:p-10 transition-all">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-[#704d31] mb-4">
              BATIK CINDUR BATAM
            </h1>
            <Image
              src="/logo_batik.jpg"
              alt="Batik Cindur Batam"
              width={120}
              height={120}
              className="object-contain rounded-lg mb-4"
            />
            <h2 className="text-center text-xl md:text-2xl font-semibold text-[#5a3921]">
              Daftar Akun Baru
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
            {/* Nama */}
            <div className="flex items-center border border-[#b08968] rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 transition">
              <span className="material-icons text-[#b08968] mr-3 text-xl">person</span>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full outline-none bg-transparent text-sm md:text-base text-[#5a3921] placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-[#b08968] rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 transition">
              <span className="material-icons text-[#b08968] mr-3 text-xl">email</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none bg-transparent text-sm md:text-base text-[#5a3921] placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-[#b08968] rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 transition relative">
              <span className="material-icons text-[#b08968] mr-3 text-xl">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full outline-none bg-transparent text-sm md:text-base text-[#5a3921] placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#b08968] hover:text-[#704d31] transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Konfirmasi Password */}
            <div className="flex items-center border border-[#b08968] rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 transition relative">
              <span className="material-icons text-[#b08968] mr-3 text-xl">lock</span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Konfirmasi Kata Sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full outline-none bg-transparent text-sm md:text-base text-[#5a3921] placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 text-[#b08968] hover:text-[#704d31] transition"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-3 mt-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="mt-1 w-4 h-4 accent-[#704d31]"
              />
              <label className="text-xs md:text-sm text-gray-600 leading-tight">
                Saya menyetujui{" "}
                <span className="font-medium text-[#704d31]">
                  Syarat & Ketentuan
                </span>
              </label>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#704d31] hover:bg-[#5a3921] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 md:py-3.5 rounded-lg transition-all text-sm md:text-base font-semibold shadow-md hover:shadow-lg"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            {/* Link Login */}
            <p className="text-center text-xs md:text-sm text-gray-600 mt-4">
              Sudah punya akun?{" "}
              <a
                href="/login"
                className="text-[#704d31] font-medium hover:underline"
              >
                Masuk di sini
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
