# 🚨 QUICK FIX: Error 404 dengan Double Slash `//api/login`

## ❌ **Masalah yang Terlihat di Console**

Error: `127.0.0.1:8000//api/login:1` - **Ada double slash `//`**

---

## ✅ **SOLUSI CEPAT (3 Langkah)**

### **STEP 1: Perbaiki File `.env.local`**

Buka file `frontend/.env.local` dan pastikan **TIDAK ADA double slash**:

```env
# ✅ BENAR
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# ❌ SALAH - Jangan pakai ini!
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000//api
```

**Pastikan:**
- Tidak ada `//` di tengah URL
- Tidak ada spasi di awal/akhir
- Tidak ada tanda kutip

### **STEP 2: Hapus Cache Next.js**

```bash
cd frontend
rm -rf .next
```

### **STEP 3: Restart Server**

```bash
# Stop server (Ctrl+C jika masih running)
# Start lagi
npm run dev
```

---

## 🔍 **Verifikasi Setelah Restart**

1. **Buka browser console** (F12)
2. **Cek log**: Harus muncul `🔗 API URL (normalized): http://127.0.0.1:8000/api`
3. **Coba login** dan cek Network tab
4. **URL harus**: `http://127.0.0.1:8000/api/login` (bukan `//api/login`)

---

## 🐛 **Jika Masih Error**

### **Cek File `.env.local`**

```bash
cd frontend
cat .env.local | grep API_URL
```

Harus muncul:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

**BUKAN:**
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000//api
```

### **Cek di Browser Console**

Buka console dan ketik:
```javascript
console.log('Raw:', process.env.NEXT_PUBLIC_API_URL)
```

Jika masih muncul double slash, berarti:
1. File `.env.local` masih salah
2. Server belum di-restart
3. Cache belum di-clear

---

## 📝 **Template `.env.local` yang Benar**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:8000

# Midtrans Configuration
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

---

## ✅ **Checklist**

- [ ] File `.env.local` sudah diperbaiki (tidak ada `//`)
- [ ] Cache sudah dihapus (`rm -rf .next`)
- [ ] Server sudah di-restart
- [ ] Console log menunjukkan URL yang benar
- [ ] Network tab menunjukkan URL tanpa double slash

---

**Setelah langkah-langkah ini, error akan hilang! ✅**

