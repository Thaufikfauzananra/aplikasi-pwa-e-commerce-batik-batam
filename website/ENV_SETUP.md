# 🔧 Frontend Environment Variables Setup

## 📋 **Environment Variables yang Diperlukan**

### **1. Buat File `.env.local`**

Buat file `.env.local` di folder `frontend/`:

```env
# ============================================
# MIDTRANS CONFIGURATION
# ============================================

# Untuk Development/Sandbox:
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false

# Untuk Production:
# NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true

# ============================================
# API CONFIGURATION
# ============================================

# Backend API URL
# Untuk local development:
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Untuk VPS/Production (contoh):
# NEXT_PUBLIC_API_URL=http://151.243.222.93:33335/api

# Atau jika sudah ada domain:
# NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### **2. Dapatkan Client Key dari Midtrans**

1. **Untuk Development/Sandbox:**
   - Login ke: https://dashboard.sandbox.midtrans.com
   - Settings → Config Info
   - Copy **Client Key**

2. **Untuk Production:**
   - Login ke: https://dashboard.midtrans.com
   - Settings → Config Info
   - Copy **Client Key**

### **3. Restart Development Server**

Setelah mengubah `.env.local`, restart server:

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev
```

---

## 🔍 **Cek Konfigurasi**

Buka browser console dan ketik:

```javascript
console.log('Client Key:', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)
console.log('Is Production:', process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION)
```

Jika muncul `undefined`, berarti environment variable belum di-set.

---

## ⚠️ **Catatan Penting**

1. **Prefix `NEXT_PUBLIC_` wajib** untuk environment variables yang diakses di client-side
2. **Jangan commit `.env.local`** ke GitHub (sudah ada di `.gitignore`)
3. **Gunakan environment yang berbeda** untuk dev/prod
4. **Restart server** setelah mengubah `.env.local`

---

## 🐛 **Troubleshooting**

### **Error: Client Key tidak terdeteksi**

**Solusi:**
1. Pastikan file `.env.local` ada di folder `frontend/`
2. Pastikan menggunakan prefix `NEXT_PUBLIC_`
3. Restart development server
4. Clear cache browser (hard refresh: Ctrl+Shift+R)

### **Error: Midtrans Snap tidak dimuat**

**Solusi:**
1. Cek `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` sudah di-set
2. Cek `data-client-key` di `layout.js` sudah terisi
3. Cek network tab di DevTools untuk error loading snap.js

---

**Setelah setup selesai, pembayaran Midtrans akan berfungsi! ✅**

