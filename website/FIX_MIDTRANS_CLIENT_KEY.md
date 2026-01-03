# 🔧 Fix Warning: "Please add data-client-key attribute"

## ❌ **Warning yang Terjadi**

```
Please add `data-client-key` attribute in the script tag 
<script type="text/javascript" src="...snap.js" data-client-key="CLIENT-KEY"></script>
```

**Ini berarti Client Key belum di-set dengan benar di frontend.**

---

## ✅ **SOLUSI**

### **STEP 1: Buat/Edit File `.env.local`**

Buka folder `frontend/` dan buat/edit file `.env.local`:

```bash
cd frontend
nano .env.local
# atau
code .env.local
```

**Tambahkan konfigurasi berikut:**

```env
# ============================================
# MIDTRANS CONFIGURATION - PRODUCTION
# ============================================
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-KIgYKIEWHcHYL8uP
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true

# ============================================
# API CONFIGURATION (VPS)
# ============================================
NEXT_PUBLIC_API_URL=http://151.243.222.93:33335/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://151.243.222.93:33335
```

**⚠️ PENTING:**
- Copy **PERSIS** seperti di atas
- Client Key: `Mid-client-KIgYKIEWHcHYL8uP`
- `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true` (karena production)

---

### **STEP 2: Clear Cache Next.js**

```bash
cd frontend
rm -rf .next
```

**Ini sangat penting!** Next.js cache environment variables.

---

### **STEP 3: Restart Development Server**

```bash
# Stop server (Ctrl+C jika masih running)
# Start lagi
npm run dev
```

**Atau jika production:**
```bash
npm run build
npm start
```

---

### **STEP 4: Verifikasi**

#### **A. Cek di Browser Console**

Buka browser console (F12) dan ketik:

```javascript
console.log('Client Key:', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)
console.log('Is Production:', process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION)
```

**Harus muncul:**
```
Client Key: Mid-client-KIgYKIEWHcHYL8uP
Is Production: true
```

**Jika muncul `undefined`:**
- File `.env.local` belum dibuat/diedit
- Server belum di-restart
- Cache belum di-clear

#### **B. Cek Script Tag di HTML**

1. Buka browser DevTools (F12)
2. Tab **Elements** atau **Inspector**
3. Cari tag `<script>` yang memuat `snap.js`
4. Cek attribute `data-client-key`

**Harus muncul:**
```html
<script 
  src="https://app.midtrans.com/snap/snap.js" 
  data-client-key="Mid-client-KIgYKIEWHcHYL8uP"
></script>
```

**Jika `data-client-key` kosong atau tidak ada:**
- Environment variable belum ter-load
- Perlu restart server dan clear cache

---

## 🐛 **Troubleshooting**

### **Masih Warning Setelah Setup?**

#### **1. Cek File `.env.local` Ada**

```bash
cd frontend
ls -la .env.local
```

**Harus muncul file `.env.local`**

#### **2. Cek Isi File `.env.local`**

```bash
cat .env.local | grep MIDTRANS
```

**Harus muncul:**
```
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-KIgYKIEWHcHYL8uP
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true
```

#### **3. Pastikan Tidak Ada Spasi**

**✅ BENAR:**
```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-KIgYKIEWHcHYL8uP
```

**❌ SALAH:**
```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY = Mid-client-KIgYKIEWHcHYL8uP
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-KIgYKIEWHcHYL8uP"
```

#### **4. Clear Cache & Restart Lagi**

```bash
cd frontend
rm -rf .next
npm run dev
```

#### **5. Hard Refresh Browser**

- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

---

## 📋 **Checklist**

- [ ] File `.env.local` ada di folder `frontend/`
- [ ] `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-KIgYKIEWHcHYL8uP` sudah di-set
- [ ] `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true` sudah di-set
- [ ] Tidak ada spasi sebelum/sesudah `=`
- [ ] Tidak pakai tanda kutip
- [ ] Cache sudah di-clear (`rm -rf .next`)
- [ ] Server sudah di-restart
- [ ] Browser console menunjukkan Client Key benar
- [ ] Script tag memiliki `data-client-key` attribute

---

## ⚠️ **Tentang Error Lain**

### **Error New Relic (`ERR_BLOCKED_BY_CLIENT`)**

```
GET https://js-agent.newrelic.com/nr-spa-1.288.1.min.js net::ERR_BLOCKED_BY_CLIENT
```

**Ini BUKAN masalah!** 
- Error ini muncul karena ad blocker memblokir tracking script
- Tidak mempengaruhi fungsi aplikasi
- Bisa diabaikan

### **Warning Lazy Loading Images**

```
[Intervention] Images loaded lazily and replaced with placeholders
```

**Ini hanya info, bukan error!**
- Browser mengoptimalkan loading images
- Tidak mempengaruhi fungsi aplikasi
- Bisa diabaikan

---

## ✅ **Setelah Setup Selesai**

1. Warning `data-client-key` akan hilang
2. Midtrans Snap akan ter-load dengan benar
3. Payment popup akan muncul saat checkout
4. Pembayaran akan berfungsi normal

---

**Setup selesai! Warning akan hilang! ✅**

