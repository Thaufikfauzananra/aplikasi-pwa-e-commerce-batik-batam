import axios from "axios";

// Fallback ke default URL jika environment variable tidak ada
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// Debug: Log API URL (hanya di development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔗 API URL:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false, // Disable untuk menghindari CORS issue
  timeout: 30000, // 30 seconds timeout (diperpanjang untuk upload file)
});

// 🔒 Interceptor: tambahkan token auth otomatis kalau ada
api.interceptors.request.use(
  (config) => {
    // Hanya akses localStorage jika di browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔄 Interceptor response: handle error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token expired atau unauthorized, redirect ke login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        // Jangan redirect di halaman login/register
        if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
