import axios from "axios";

// Express Backend URL (hosted on Vercel)
// Development: http://localhost:3001/api
// Production: Set NEXT_PUBLIC_API_URL in .env.production or Vercel environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api";

// Debug: Log API URL (hanya di development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔗 API URL:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
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
      // Debug log
      if (process.env.NODE_ENV === "development") {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
          token: token ? "✅ Present" : "❌ Missing",
          timestamp: new Date().toISOString(),
        });
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 🔄 Interceptor response: handle error global
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`📥 ${response.status} - ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    const { response, config, message } = error;
    
    // Log detailed error information
    console.error("❌ API Error:", {
      status: response?.status,
      statusText: response?.statusText,
      url: config?.url,
      method: config?.method?.toUpperCase(),
      data: response?.data,
      message: message,
      timestamp: new Date().toISOString(),
    });

    // Jika token expired atau unauthorized, redirect ke login
    if (response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        // Jangan redirect di halaman login/register
        if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
          window.location.href = "/login";
        }
      }
    }

    // Jika 500 error, log ke console dengan lebih detail
    if (response?.status === 500) {
      console.error("⚠️ Server Error (500):", response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
