# 🔧 Konfigurasi Environment Variables untuk Production/VPS

## ✅ **Konfigurasi yang Benar**

### **File: `frontend/.env.local` atau `frontend/.env.production`**

```env
# ============================================
# API CONFIGURATION (VPS)
# ============================================
NEXT_PUBLIC_API_URL=http://151.243.222.93:33335/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://151.243.222.93:33335

# ============================================
# MIDTRANS CONFIGURATION
# ============================================
# Untuk Production:
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true

# Untuk Sandbox/Development:
# NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

---

## 📋 **Penjelasan Konfigurasi**

### **1. NEXT_PUBLIC_API_URL**
- **URL:** `http://151.243.222.93:33335/api`
- **Digunakan untuk:** Semua API calls (login, register, products, dll)
- **Format:** `http://IP:PORT/api`
- **Pastikan:** Tidak ada double slash (`//`)

### **2. NEXT_PUBLIC_BACKEND_BASE_URL**
- **URL:** `http://151.243.222.93:33335`
- **Digunakan untuk:** Image URLs dari Laravel storage
- **Format:** `http://IP:PORT` (tanpa `/api`)
- **Pastikan:** Tidak ada trailing slash

---

## 🚀 **Setup**

### **STEP 1: Buat/Edit File `.env.local`**

```bash
cd frontend
nano .env.local
# atau
code .env.local
```

### **STEP 2: Tambahkan Konfigurasi**

Copy konfigurasi di atas ke file `.env.local`

### **STEP 3: Clear Cache & Restart**

```bash
cd frontend
rm -rf .next
npm run dev
# atau untuk production
npm run build
npm start
```

---

## ✅ **Verifikasi**

### **1. Cek di Browser Console**

Buka browser console (F12) dan ketik:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL)
```

**Harus muncul:**
```
API URL: http://151.243.222.93:33335/api
Backend URL: http://151.243.222.93:33335
```

### **2. Test API Endpoint**

Buka browser console dan ketik:

```javascript
fetch('http://151.243.222.93:33335/api/hello')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

**Harus return JSON response.**

### **3. Test Login**

1. Buka halaman login
2. Coba login
3. Cek Network tab (F12)
4. Request harus ke: `http://151.243.222.93:33335/api/login`
5. **BUKAN:** `http://151.243.222.93:33335//api/login`

---

## 🐛 **Troubleshooting**

### **Error: "Route could not be found"**

**Penyebab:**
1. Backend tidak running di port 33335
2. URL salah (ada double slash)
3. Firewall memblokir port 33335

**Solusi:**
1. Cek backend running: `curl http://151.243.222.93:33335/api/hello`
2. Cek file `.env.local` tidak ada double slash
3. Cek firewall/security group VPS

### **Error: "Network Error" atau "ERR_CONNECTION_REFUSED"**

**Penyebab:**
1. Backend server tidak running
2. Port 33335 tidak terbuka
3. IP address salah

**Solusi:**
1. SSH ke VPS dan cek: `netstat -tulpn | grep 33335`
2. Pastikan backend running: `php artisan serve --host=0.0.0.0 --port=33335`
3. Cek firewall: `sudo ufw allow 33335`

### **Error: CORS Policy**

**Penyebab:**
- Backend tidak mengizinkan request dari frontend domain

**Solusi:**
1. Edit `backend/app/Http/Middleware/HandleCors.php`
2. Tambahkan frontend domain/IP ke allowed origins
3. Clear cache: `php artisan config:clear`

---

## 📝 **Catatan Penting**

1. **Jangan commit `.env.local` ke GitHub**
   - File ini sudah ada di `.gitignore`
   - Gunakan `.env.example` sebagai template

2. **Gunakan HTTPS untuk Production**
   - Jika sudah ada SSL certificate:
   ```env
   NEXT_PUBLIC_API_URL=https://your-domain.com/api
   NEXT_PUBLIC_BACKEND_BASE_URL=https://your-domain.com
   ```

3. **Port 33335**
   - Pastikan port ini terbuka di firewall
   - Pastikan tidak conflict dengan service lain

4. **IP Address**
   - `151.243.222.93` adalah IP VPS Anda
   - Pastikan IP ini benar dan accessible

---

## ✅ **Checklist**

- [ ] File `.env.local` sudah dibuat
- [ ] `NEXT_PUBLIC_API_URL` sudah di-set: `http://151.243.222.93:33335/api`
- [ ] `NEXT_PUBLIC_BACKEND_BASE_URL` sudah di-set: `http://151.243.222.93:33335`
- [ ] Tidak ada double slash di URL
- [ ] Cache sudah di-clear (`rm -rf .next`)
- [ ] Server sudah di-restart
- [ ] Backend running di port 33335
- [ ] Test endpoint `/api/hello` berhasil
- [ ] Test login berhasil

---

**Setelah setup selesai, aplikasi akan terhubung ke VPS! ✅**

