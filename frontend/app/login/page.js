"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";
import api from "../../lib/axios";

// Spinner loading
const Spinner = () => (
  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load rememberMe & stored email
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";

    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan Kata Sandi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });

      const { token, access_token, user, role } = response.data;
      const finalToken = token || access_token;

      if (finalToken) localStorage.setItem("token", finalToken);
      if (user) localStorage.setItem("userData", JSON.stringify(user));

      const userRole = role || user?.role || "user";
      localStorage.setItem("userRole", userRole);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
      }

      if (userRole === "admin") router.push("/admin/dashboard");
      else router.push("/Beranda");

    } catch (error) {
      let errorMessage = "Login gagal! Periksa kembali email dan kata sandi Anda.";

      if (error.code === "ERR_NETWORK") {
        errorMessage = "Tidak bisa terhubung ke backend! Pastikan server Laravel berjalan.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors)
          .flat()
          .join("; ");
        errorMessage = `Validasi Gagal: ${validationErrors}`;
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,rgba(192,138,62,0.18),rgba(254,250,246,0.95))]">
      <Navbar />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#c08a3e]/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7b4d2a]/5 blur-3xl rounded-full"></div>
      </div>

      {/* CENTERED CONTAINER */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12">

        {/* LOGIN CARD */}
        <div className="w-full max-w-md">
          <div className="px-8 py-10 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30">

            {/* Header */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-[#7b4d2a]/10 rounded-xl">
                  <LogIn className="text-[#7b4d2a]" size={26} />
                </div>
                <h2 className="text-3xl font-bold text-[#5c3316]">
                  Masuk ke akun Anda
                </h2>
              </div>
              <p className="text-sm text-[#5c3316]/80 max-w-sm mx-auto">
                Nikmati pengalaman berbelanja batik eksklusif dengan kurasi terbaik dan layanan istimewa.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[#5c3316] flex items-center gap-2">
                  <User className="text-[#c08a3e]" size={17} />
                  Nama Pengguna atau Email
                </label>

                <div className="mt-2 flex items-center border rounded-2xl px-4 py-3 bg-white/70 shadow-inner border-[#d1b799]">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan nama pengguna atau email"
                    className="w-full bg-transparent outline-none text-[#5c3316]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-[#5c3316] flex items-center gap-2">
                  <Lock className="text-[#c08a3e]" size={17} />
                  Kata Sandi
                </label>

                <div className="mt-2 relative flex items-center border rounded-2xl px-4 py-3 bg-white/70 shadow-inner border-[#d1b799]">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full bg-transparent outline-none text-[#5c3316]"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#c08a3e]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm text-red-600 bg-red-100 p-3 rounded-xl border border-red-300">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#5c3316]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-[#7b4d2a]"
                  />
                  Ingat saya
                </label>

                <a href="/forgot-password" className="text-sm text-[#7b4d2a] hover:text-[#5c3316]">
                  Lupa kata sandi?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7b4d2a] text-white py-3 rounded-2xl font-semibold shadow-md hover:bg-[#5c3316] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Spinner /> Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Masuk ke akun
                  </>
                )}
              </button>

            </form>

            {/* Footer */}
            <div className="text-center mt-6 text-sm">
              Belum memiliki akun?
              <a
                href="/register"
                className="ml-1 font-semibold text-[#7b4d2a] hover:text-[#5c3316]"
              >
                Daftar sekarang
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
