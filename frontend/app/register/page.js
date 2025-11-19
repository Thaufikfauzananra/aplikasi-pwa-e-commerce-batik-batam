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
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,rgba(192,138,62,0.18),rgba(254,250,246,0.95))]">
      <Navbar />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-6xl flex-col overflow-hidden px-4 py-8 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12 lg:py-12">
        <div className="relative mb-10 flex w-full max-w-xl flex-1 justify-center md:order-2 md:mb-0">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f6e7d4] via-transparent to-[#c08a3e]/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-[36px] border border-[#e3d6c5] bg-white/30 p-4 shadow-[0_25px_70px_-40px_rgba(91,55,23,0.6)]">
            <div className="absolute inset-x-10 top-6 h-32 rounded-full bg-white/15 blur-3xl" />
            <Image
              src="/wanita1.jpg"
              alt="Batik Cindur Premium"
              width={600}
              height={720}
              className="relative rounded-[28px] object-cover shadow-2xl"
              priority
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-lg backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.3em] text-[#c08a3e] font-semibold">
                Eksklusif anggota
              </p>
              <p className="mt-1 text-base font-semibold text-[#5c3316]">
                Dapatkan poin belanja dan akses pre-order khusus.
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-md md:order-1">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/60 to-white/20 blur-3xl" />
          <div className="glass-card px-6 py-6 md:px-8 md:py-10">
            <div className="flex flex-col gap-3 text-center md:text-left">
              <span className="floating-badge self-center md:self-start">
                Buat akun baru
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#5c3316]">
                Mulai perjalanan eksklusifmu bersama Batik Cindur Batam
              </h2>
              <p className="text-sm text-[#5c3316]/70">
                Daftarkan dirimu dan nikmati kurasi batik istimewa, penawaran spesial, serta layanan pelanggan prioritas.
              </p>
            </div>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <label className="flex flex-col gap-2 text-sm font-medium text-[#5c3316]">
                <span>Nama Lengkap</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#d1b799] bg-white/70 px-4 py-3 shadow-inner focus-within:border-[#c08a3e] focus-within:ring-2 focus-within:ring-[#c08a3e]/30 transition">
                  <span className="material-icons text-[#c08a3e]">person</span>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="luxury-input border-none bg-transparent px-0 py-0 text-[#5c3316] shadow-none focus:outline-none"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[#5c3316]">
                <span>Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#d1b799] bg-white/70 px-4 py-3 shadow-inner focus-within:border-[#c08a3e] focus-within:ring-2 focus-within:ring-[#c08a3e]/30 transition">
                  <span className="material-icons text-[#c08a3e]">email</span>
                  <input
                    type="email"
                    placeholder="Masukkan email aktif"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="luxury-input border-none bg-transparent px-0 py-0 text-[#5c3316] shadow-none focus:outline-none"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[#5c3316]">
                <span>Kata Sandi</span>
                <div className="relative flex items-center gap-3 rounded-2xl border border-[#d1b799] bg-white/70 px-4 py-3 shadow-inner focus-within:border-[#c08a3e] focus-within:ring-2 focus-within:ring-[#c08a3e]/30 transition">
                  <span className="material-icons text-[#c08a3e]">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="luxury-input border-none bg-transparent px-0 py-0 text-[#5c3316] shadow-none focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#c08a3e] hover:text-[#7b4d2a] transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[#5c3316]">
                <span>Konfirmasi Kata Sandi</span>
                <div className="relative flex items-center gap-3 rounded-2xl border border-[#d1b799] bg-white/70 px-4 py-3 shadow-inner focus-within:border-[#c08a3e] focus-within:ring-2 focus-within:ring-[#c08a3e]/30 transition">
                  <span className="material-icons text-[#c08a3e]">lock</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="luxury-input border-none bg-transparent px-0 py-0 text-[#5c3316] shadow-none focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 text-[#c08a3e] hover:text-[#7b4d2a] transition"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>

              <div className="mt-2 flex items-start gap-3 rounded-2xl border border-[#e3d6c5] bg-white/70 px-4 py-4">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="mt-1 h-4 w-4 accent-[#7b4d2a]"
                />
                <p className="text-xs md:text-sm text-[#5c3316]/70 leading-relaxed">
                  Saya menyetujui{" "}
                  <span className="font-semibold text-[#7b4d2a]">
                    Syarat &amp; Ketentuan
                  </span>{" "}
                  serta kebijakan privasi Batik Cindur Batam.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full luxury-button primary-button text-base disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Daftar sekarang"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#5c3316]/70 md:text-sm">
              Sudah punya akun?
              <a
                href="/login"
                className="ml-1 font-semibold text-[#7b4d2a] hover:text-[#5c3316] transition"
              >
                Masuk di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
