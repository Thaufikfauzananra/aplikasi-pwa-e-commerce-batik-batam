# 🔧 Restore Konfigurasi ke VPS: 151.243.222.93:33335

## ✅ **Konfigurasi yang Benar (Seperti Sebelumnya)**

### **File: `frontend/.env.local`**

Buat atau edit file `frontend/.env.local` dengan konfigurasi berikut:

```env
# ============================================
# API CONFIGURATION (VPS)
# ============================================
NEXT_PUBLIC_API_URL=http://151.243.222.93:33335/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://151.243.222.93:33335

# ============================================
# MIDTRANS CONFIGURATION
# ============================================
# Sesuaikan dengan key Anda
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key_here
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true
```

---

## 🚀 **Langkah-Langkah Restore**

### **STEP 1: Buat/Edit File `.env.local`**

```bash
cd frontend
nano .env.local
# atau
code .env.local
# atau
notepad .env.local
```

**Copy konfigurasi di atas ke file tersebut.**

### **STEP 2: Pastikan Tidak Ada Double Slash**

Pastikan URL **TIDAK** seperti ini:
```env
# ❌ SALAH
NEXT_PUBLIC_API_URL=http://151.243.222.93:33335//api
```

Harus seperti ini:
```env
# ✅ BENAR
NEXT_PUBLIC_API_URL=http://151.243.222.93:33335/api
```

### **STEP 3: Hapus Cache Next.js**

```bash
cd frontend
rm -rf .next
# atau di Windows PowerShell:
Remove-Item -Recurse -Force .next
```

### **STEP 4: Restart Development Server**

```bash
# Stop server jika masih running (Ctrl+C)
# Start lagi
npm run dev
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

### **2. Cek Log di Console**

Saat aplikasi load, harus muncul:
```
🔗 API URL (normalized): http://151.243.222.93:33335/api
🔗 API URL (raw env): http://151.243.222.93:33335/api
```

### **3. Test API Endpoint**

Buka browser console dan ketik:

```javascript
fetch('http://151.243.222.93:33335/api/hello')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

**Harus return JSON response.**

### **4. Test Login**

1. Buka halaman login
2. Coba login
3. Cek Network tab (F12)
4. Request harus ke: `http://151.243.222.93:33335/api/login`
5. **BUKAN:** `http://151.243.222.93:33335//api/login`

---

## 🐛 **Troubleshooting**

### **Masalah: Environment variable tidak terbaca**

**Solusi:**
1. Pastikan file `.env.local` ada di folder `frontend/`
2. Pastikan menggunakan prefix `NEXT_PUBLIC_`
3. Restart server setelah mengubah `.env.local`
4. Hapus cache: `rm -rf .next`

### **Masalah: Masih error 404**

**Solusi:**
1. Cek backend running: `curl http://151.243.222.93:33335/api/hello`
2. Cek file `.env.local` tidak ada double slash
3. Clear cache dan restart
4. Cek console log untuk URL yang digunakan

### **Masalah: CORS Error**

**Solusi:**
- CORS sudah dikonfigurasi di backend untuk mengizinkan semua origin
- Jika masih error, pastikan backend running dan CORS middleware aktif

---

## 📋 **Checklist**

- [ ] File `.env.local` sudah dibuat di `frontend/`
- [ ] `NEXT_PUBLIC_API_URL=http://151.243.222.93:33335/api` (tanpa `//`)
- [ ] `NEXT_PUBLIC_BACKEND_BASE_URL=http://151.243.222.93:33335` (tanpa trailing slash)
- [ ] Cache sudah dihapus (`rm -rf .next`)
- [ ] Server sudah di-restart
- [ ] Console log menunjukkan URL yang benar
- [ ] Test endpoint `/api/hello` berhasil
- [ ] Test login berhasil

---

## ✅ **Setelah Setup Selesai**

Aplikasi akan kembali berfungsi seperti sebelumnya dengan konfigurasi:
- **API URL:** `http://151.243.222.93:33335/api`
- **Backend URL:** `http://151.243.222.93:33335`

**Semua fitur akan kembali normal! ✅**

