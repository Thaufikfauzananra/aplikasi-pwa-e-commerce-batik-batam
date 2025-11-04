"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import api from "../../lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });

      console.log("✅ Login success:", response.data);
      
      // Save token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      
      // Save user data
      if (response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
      
      // Save role
      if (response.data.role) {
        localStorage.setItem("userRole", response.data.role);
      }
      
      // Redirect berdasarkan role
      const userRole = response.data.role || response.data.user?.role || 'user';
      if (userRole === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/Beranda");
      }
    } catch (error) {
      console.error("❌ Login gagal:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      let errorMessage = "Login gagal! Periksa kembali email dan kata sandi kamu.";
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = "Tidak bisa terhubung ke backend!\n\nPastikan backend Laravel sudah running:\ncd backend\nphp artisan serve";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = JSON.stringify(error.response.data.errors);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
          {/* Logo & Title - Mobile Layout */}
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
              Selamat Datang
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            {/* Email/Username */}
            <div className="flex items-center border border-[#b08968] rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-[#b08968]/50 transition">
              <span className="material-icons text-[#b08968] mr-3 text-xl">person</span>
              <input
                type="text"
                placeholder="Nama Pengguna"
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

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#704d31] hover:bg-[#5a3921] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 md:py-3.5 rounded-lg transition-all text-sm md:text-base font-semibold shadow-md hover:shadow-lg"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            {/* Link ke Register */}
            <p className="text-center text-xs md:text-sm text-gray-600 mt-4">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-[#704d31] font-medium hover:underline"
              >
                Daftar Sekarang
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
