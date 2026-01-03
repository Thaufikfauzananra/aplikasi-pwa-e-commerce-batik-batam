"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Eye, EyeOff, LogIn, User, Lock, Sparkles, Chrome } from "lucide-react";
import api from "../../lib/axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Animation trigger on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load rememberMe & stored email
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";

    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      // Send Google token to backend
      const response = await api.post("/login-with-google", {
        token: credentialResponse.credential,
      });

      const { token, access_token, user, role } = response.data;
      const finalToken = token || access_token;

      if (finalToken) localStorage.setItem("token", finalToken);
      if (user) localStorage.setItem("userData", JSON.stringify(user));

      const userRole = role || user?.role || "user";
      localStorage.setItem("userRole", userRole);

      if (userRole === "admin") router.push("/admin/dashboard");
      else router.push("/Beranda");

    } catch (error) {
      let errorMessage = "Login Google gagal!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Tidak bisa terhubung ke backend!";
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Error
  const handleGoogleError = () => {
    setError("Login Google gagal! Silakan coba lagi.");
    alert("Login Google gagal! Silakan coba lagi.");
  };

  // Handle Regular Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { token, access_token, user, role } = response.data;
      const finalToken = token || access_token;

      if (finalToken) localStorage.setItem("token", finalToken);
      if (user) localStorage.setItem("userData", JSON.stringify(user));

      const userRole = role || user?.role || "user";
      localStorage.setItem("userRole", userRole);

      if (rememberMe) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("rememberMe");
      }

      if (userRole === "admin") router.push("/admin/dashboard");
      else router.push("/Beranda");

    } catch (error) {
      let errorMessage = "Login gagal!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Tidak bisa terhubung ke backend!";
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <div className="relative min-h-screen bg-gradient-to-br from-[#fefaf6] via-[#fff8f0] to-[#f5ebe0] overflow-hidden">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating orbs with animation */}
        <div className={`absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#c08a3e]/20 to-[#7b4d2a]/10 blur-3xl rounded-full transition-all duration-[2000ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}`}></div>
        <div className={`absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-[#7b4d2a]/15 to-[#c08a3e]/10 blur-3xl rounded-full transition-all duration-[2500ms] delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}></div>
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-[#d4a574]/10 blur-2xl rounded-full transition-all duration-[3000ms] delay-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-[#c08a3e]/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-[15%] w-3 h-3 bg-[#7b4d2a]/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-[#d4a574]/40 rounded-full animate-float"></div>
        <div className="absolute top-1/2 right-[10%] w-4 h-4 bg-[#c08a3e]/15 rounded-full animate-float-slow"></div>
        
        {/* Decorative batik pattern overlay */}
        <div className={`absolute inset-0 opacity-[0.02] transition-opacity duration-[2000ms] ${mounted ? 'opacity-[0.02]' : 'opacity-0'}`} 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%237b4d2a' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      {/* CENTERED CONTAINER */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12">

        {/* LOGIN CARD with entrance animation */}
        <div className={`w-full max-w-md transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          
          {/* Glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#c08a3e]/20 via-[#7b4d2a]/10 to-[#c08a3e]/20 blur-2xl rounded-3xl transform scale-105 animate-pulse-slow"></div>
          
          <div className="relative px-8 py-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(123,77,42,0.25)] border border-white/50 overflow-hidden">
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>

            {/* Header with staggered animation */}
            <div className={`text-center space-y-3 mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#7b4d2a] to-[#5c3316] rounded-2xl shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300 group">
                  <LogIn className="text-white group-hover:animate-bounce" size={26} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#5c3316] to-[#7b4d2a] bg-clip-text text-transparent">
                    Selamat Datang
                  </h2>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Sparkles size={12} className="text-[#c08a3e] animate-pulse" />
                    <span className="text-xs uppercase tracking-[0.2em] text-[#c08a3e] font-medium">Batik Cindur Batam</span>
                    <Sparkles size={12} className="text-[#c08a3e] animate-pulse" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#5c3316]/70 max-w-sm mx-auto leading-relaxed">
                Masuk untuk menikmati pengalaman berbelanja batik eksklusif
              </p>
            </div>

            {/* FORM with staggered animations */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email Field */}
              <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-sm font-medium text-[#5c3316] flex items-center gap-2 mb-2">
                  <User className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-[#7b4d2a]' : 'text-[#c08a3e]'}`} size={17} />
                  Email atau Username
                </label>

                <div className={`relative flex items-center border-2 rounded-2xl px-4 py-3.5 bg-white/90 shadow-sm transition-all duration-300 ${focusedField === 'email' ? 'border-[#7b4d2a] shadow-[0_0_0_4px_rgba(123,77,42,0.1)]' : 'border-[#e3d6c5] hover:border-[#c08a3e]'}`}>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="nama@email.com"
                    className="w-full bg-transparent outline-none text-[#5c3316] placeholder:text-[#c08a3e]/50"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="text-sm font-medium text-[#5c3316] flex items-center gap-2 mb-2">
                  <Lock className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-[#7b4d2a]' : 'text-[#c08a3e]'}`} size={17} />
                  Kata Sandi
                </label>

                <div className={`relative flex items-center border-2 rounded-2xl px-4 py-3.5 bg-white/90 shadow-sm transition-all duration-300 ${focusedField === 'password' ? 'border-[#7b4d2a] shadow-[0_0_0_4px_rgba(123,77,42,0.1)]' : 'border-[#e3d6c5] hover:border-[#c08a3e]'}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-[#5c3316] placeholder:text-[#c08a3e]/50"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#c08a3e] hover:text-[#7b4d2a] transition-colors duration-300 hover:scale-110 transform"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error with animation */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-200 animate-shake">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Remember me & Forgot password */}
              <div className={`flex items-center justify-between transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="flex items-center gap-2 text-sm text-[#5c3316] cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-[#7b4d2a] rounded transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="group-hover:text-[#7b4d2a] transition-colors duration-200">Ingat saya</span>
                </label>

                <a href="/forgot-password" className="text-sm text-[#7b4d2a] hover:text-[#5c3316] hover:underline transition-all duration-200">
                  Lupa kata sandi?
                </a>
              </div>

              {/* Submit Button with hover effects */}
              <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full bg-gradient-to-r from-[#7b4d2a] to-[#5c3316] text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#7b4d2a]/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {/* Button shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  
                  {loading ? (
                    <>
                      <Spinner /> Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="group-hover:rotate-12 transition-transform duration-300" /> 
                      Masuk ke Akun
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className={`flex items-center gap-4 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e3d6c5]"></div>
                <span className="text-xs uppercase tracking-widest text-[#c08a3e] font-medium">atau</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e3d6c5]"></div>
              </div>

              {/* Google Login Button */}
              <div className={`transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {googleClientId ? (
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="light"
                      text="signin_with"
                      size="large"
                      logo_alignment="center"
                      locale="id_ID"
                    />
                  </div>
                ) : (
                  <p className="text-center text-sm text-red-600">Google Client ID tidak ditemukan</p>
                )}
              </div>

            </form>

            {/* Footer with animation */}
            <div className={`text-center mt-8 pt-6 border-t border-[#e3d6c5]/50 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-sm text-[#5c3316]/70">Belum memiliki akun?</span>
              <a
                href="/register"
                className="ml-2 font-semibold text-[#7b4d2a] hover:text-[#5c3316] relative group"
              >
                Daftar sekarang
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7b4d2a] group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
    </GoogleOAuthProvider>
  );
}
