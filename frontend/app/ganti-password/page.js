"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import api from "../../lib/axios";

export default function GantiPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error saat user mengetik
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.current_password) {
      newErrors.current_password = "Password lama harus diisi";
    }

    if (!formData.new_password) {
      newErrors.new_password = "Password baru harus diisi";
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "Password minimal 6 karakter";
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Konfirmasi password harus diisi";
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Password tidak cocok";
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = "Password baru harus berbeda dengan password lama";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await api.put("/change-password", {
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      });

      setSuccess(true);
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      setTimeout(() => {
        router.push("/profil");
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.current_password?.[0] ||
        "Gagal mengubah password. Periksa password lama Anda.";

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { text: "", color: "" };
    if (password.length < 6) return { text: "Lemah", color: "text-red-500" };
    if (password.length < 8)
      return { text: "Sedang", color: "text-yellow-500" };
    return { text: "Kuat", color: "text-green-500" };
  };

  const strength = getPasswordStrength(formData.new_password);

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar showBack={true} />

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#704d31] rounded-lg text-white">
            <Lock size={24} />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#5a3921]">
            Ganti Password
          </h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                Password berhasil diubah!
              </p>
              <p className="text-sm text-green-600">
                Mengarahkan ke halaman profil...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#e7d9c6] p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                Password Lama *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                  className={`w-full border ${
                    errors.current_password
                      ? "border-red-500"
                      : "border-[#b08968]"
                  } rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50`}
                  placeholder="Masukkan password lama"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b08968] hover:text-[#704d31] transition"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.current_password}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                Password Baru *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className={`w-full border ${
                    errors.new_password ? "border-red-500" : "border-[#b08968]"
                  } rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50`}
                  placeholder="Masukkan password baru (min. 6 karakter)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b08968] hover:text-[#704d31] transition"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.new_password}
                </p>
              )}
              {formData.new_password && !errors.new_password && (
                <p className={`text-xs mt-1 ${strength.color}`}>
                  Kekuatan: {strength.text}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                Konfirmasi Password Baru *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="new_password_confirmation"
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  required
                  className={`w-full border ${
                    errors.new_password_confirmation
                      ? "border-red-500"
                      : "border-[#b08968]"
                  } rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50`}
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b08968] hover:text-[#704d31] transition"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.new_password_confirmation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.new_password_confirmation}
                </p>
              )}
              {formData.new_password_confirmation &&
                formData.new_password === formData.new_password_confirmation &&
                !errors.new_password_confirmation && (
                  <p className="text-green-500 text-xs mt-1">Password cocok</p>
                )}
            </div>

            {/* Info */}
            <div className="bg-[#fefaf6] border border-[#e7d9c6] rounded-lg p-4">
              <p className="text-sm text-[#5a3921]">
                <strong>Tips Password yang Aman:</strong>
              </p>
              <ul className="text-xs text-[#b08968] mt-2 space-y-1 list-disc list-inside">
                <li>Minimal 6 karakter (disarankan 8+ karakter)</li>
                <li>Gunakan kombinasi huruf, angka, dan simbol</li>
                <li>Jangan gunakan informasi pribadi</li>
                <li>Jangan bagikan password kepada siapa pun</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#704d31] hover:bg-[#5a3921] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 md:py-4 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
              {loading ? "Memproses..." : "Ubah Password"}
            </button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

