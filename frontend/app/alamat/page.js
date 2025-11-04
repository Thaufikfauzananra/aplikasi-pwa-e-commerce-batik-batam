"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { MapPin, Plus, Edit2, Trash2, Check, Home, Building2 } from "lucide-react";
import api from "../../lib/axios";

export default function AlamatPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    recipient_name: "",
    recipient_phone: "",
    province: "",
    city: "",
    district: "",
    postal_code: "",
    address: "",
    is_default: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/addresses");
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Jika API belum tersedia, gunakan dummy data
      setAddresses([
        {
          id: 1,
          label: "Rumah",
          recipient_name: "Muhammad Nabil",
          recipient_phone: "081234567890",
          province: "Kepulauan Riau",
          city: "Batam",
          district: "Sekupang",
          postal_code: "29425",
          address: "Jl. Soekarno Hatta No. 123, RT 001 RW 002",
          is_default: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update address
        await api.put(`/addresses/${editingId}`, formData);
        alert("Alamat berhasil diperbarui ✅");
      } else {
        // Create new address
        await api.post("/addresses", formData);
        alert("Alamat berhasil ditambahkan ✅");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        label: "",
        recipient_name: "",
        recipient_phone: "",
        province: "",
        city: "",
        district: "",
        postal_code: "",
        address: "",
        is_default: false,
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      alert(
        error.response?.data?.message || "Gagal menyimpan alamat. Silakan coba lagi."
      );
    }
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label,
      recipient_name: address.recipient_name,
      recipient_phone: address.recipient_phone,
      province: address.province,
      city: address.city,
      district: address.district,
      postal_code: address.postal_code,
      address: address.address,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus alamat ini?")) return;

    try {
      await api.delete(`/addresses/${id}`);
      alert("Alamat berhasil dihapus ✅");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Gagal menghapus alamat. Silakan coba lagi.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}/set-default`);
      alert("Alamat default berhasil diubah ✅");
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default:", error);
      alert("Gagal mengubah alamat default. Silakan coba lagi.");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      label: "",
      recipient_name: "",
      recipient_phone: "",
      province: "",
      city: "",
      district: "",
      postal_code: "",
      address: "",
      is_default: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#fefaf6] pb-20 md:pb-0">
      <Navbar showBack={true} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#704d31] rounded-lg text-white">
              <MapPin size={24} />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#5a3921]">
              Alamat Pengiriman
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#704d31] hover:bg-[#5a3921] text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              <span className="hidden md:inline">Tambah Alamat</span>
            </button>
          )}
        </div>

        {/* Form Tambah/Edit Alamat */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[#e7d9c6] p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5a3921] mb-4">
              {editingId ? "Edit Alamat" : "Tambah Alamat Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                  Label Alamat *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Rumah, Kantor"
                  className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                    No. HP Penerima *
                  </label>
                  <input
                    type="tel"
                    name="recipient_phone"
                    value={formData.recipient_phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                  Provinsi *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                    Kota/Kabupaten *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                    Kecamatan *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                  Kode Pos *
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5a3921] mb-2">
                  Alamat Lengkap *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-[#b08968] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968]/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_default"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#704d31] border-[#b08968] rounded focus:ring-[#b08968]"
                />
                <label htmlFor="is_default" className="text-sm text-[#5a3921]">
                  Jadikan sebagai alamat default
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#704d31] hover:bg-[#5a3921] text-white py-2 rounded-lg font-medium transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#5a3921] py-2 rounded-lg font-medium transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#b08968]">Memuat...</div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e7d9c6] p-8 text-center">
            <MapPin size={48} className="mx-auto text-[#b08968] mb-4" />
            <p className="text-[#5a3921] font-medium mb-2">
              Belum ada alamat pengiriman
            </p>
            <p className="text-sm text-[#b08968] mb-4">
              Tambah alamat untuk memudahkan pengiriman
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#704d31] hover:bg-[#5a3921] text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              Tambah Alamat
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-xl border border-[#e7d9c6] p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    {address.label === "Rumah" || address.label === "Home" ? (
                      <Home size={20} className="text-[#704d31]" />
                    ) : (
                      <Building2 size={20} className="text-[#704d31]" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#5a3921]">
                          {address.label}
                        </h3>
                        {address.is_default && (
                          <span className="bg-[#704d31] text-white text-xs px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#b08968] mt-1">
                        {address.recipient_name} • {address.recipient_phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="p-2 text-[#704d31] hover:bg-[#fefaf6] rounded-lg transition"
                        title="Jadikan default"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-[#704d31] hover:bg-[#fefaf6] rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-[#5a3921] pl-8">
                  <p>{address.address}</p>
                  <p className="text-[#b08968] mt-1">
                    {address.district}, {address.city}, {address.province}{" "}
                    {address.postal_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

