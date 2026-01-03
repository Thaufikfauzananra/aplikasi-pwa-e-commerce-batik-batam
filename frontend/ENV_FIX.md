# 🔧 Perbaikan Error "The route api/login could not be found"

## ❌ **Masalah yang Ditemukan**

1. **Double slash di URL**: `http://127.0.0.1:8000//api` (seharusnya `http://127.0.0.1:8000/api`)
2. **URL tidak ter-normalize** dengan benar

---

## ✅ **Solusi**

### **1. Perbaiki File `.env.local` di Frontend**

Edit file `frontend/.env.local` dan pastikan URL benar (tanpa double slash):

```env
# ✅ BENAR - Tanpa double slash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:8000

# ❌ SALAH - Ada double slash
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000//api
```

### **2. Kode Sudah Diperbaiki**

File `frontend/lib/axios.js` sudah diperbaiki untuk:
- ✅ Menghilangkan trailing slashes
- ✅ Memperbaiki double slashes
- ✅ Memastikan URL selalu berakhir dengan `/api`

File `frontend/lib/image.js` juga sudah diperbaiki untuk:
- ✅ Menghilangkan trailing slashes
- ✅ Memperbaiki double slashes

### **3. Restart Development Server**

Setelah mengubah `.env.local`:

```bash
cd frontend
# Stop server (Ctrl+C)
npm run dev
```

---

## 📋 **Konfigurasi yang Benar**

### **Untuk Local Development:**

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

### **Untuk VPS/Production:**

```env
# Frontend (.env.local atau .env.production)
NEXT_PUBLIC_API_URL=http://your-vps-ip:8000/api
# Atau jika sudah ada domain:
# NEXT_PUBLIC_API_URL=https://your-domain.com/api

NEXT_PUBLIC_BACKEND_BASE_URL=http://your-vps-ip:8000
# Atau jika sudah ada domain:
# NEXT_PUBLIC_BACKEND_BASE_URL=https://your-domain.com

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true
```

---

## 🔍 **Cek Konfigurasi**

### **1. Cek di Browser Console**

Buka browser console dan ketik:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL)
```

### **2. Cek Network Tab**

1. Buka DevTools (F12)
2. Tab **Network**
3. Coba login
4. Lihat request ke `/api/login`
5. Pastikan URL benar: `http://127.0.0.1:8000/api/login` (bukan `http://127.0.0.1:8000//api/login`)

---

## 🐛 **Troubleshooting**

### **Masih Error "route could not be found"?**

1. **Cek backend server running:**
   ```bash
   cd backend
   php artisan serve
   # Harus muncul: Server started on http://127.0.0.1:8000
   ```

2. **Cek route tersedia:**
   ```bash
   cd backend
   php artisan route:list | grep login
   # Harus muncul: POST /api/login
   ```

3. **Cek CORS configuration:**
   - Pastikan backend mengizinkan request dari frontend
   - Cek file `backend/app/Http/Middleware/HandleCors.php`

4. **Clear cache:**
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

---

## ✅ **Checklist**

- [ ] File `.env.local` ada di `frontend/`
- [ ] `NEXT_PUBLIC_API_URL` tidak ada double slash
- [ ] `NEXT_PUBLIC_BACKEND_BASE_URL` tidak ada double slash
- [ ] Development server sudah di-restart
- [ ] Backend server running di port 8000
- [ ] Route `/api/login` tersedia di backend

---

**Setelah perbaikan, error akan hilang! ✅**

