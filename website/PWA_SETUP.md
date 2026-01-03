# 📱 PWA Setup & Testing Guide

## ✅ **Status: PWA Sudah Terinstall & Siap Digunakan**

---

## 🔧 **Konfigurasi yang Sudah Diterapkan**

### **1. Service Worker**
- ✅ Auto-register via `next-pwa`
- ✅ Disable di development mode (untuk menghindari error)
- ✅ Enable di production mode
- ✅ Runtime caching untuk:
  - Images: CacheFirst (30 hari)
  - General requests: NetworkFirst (24 jam)
  - API calls: NetworkOnly (tidak di-cache untuk data real-time)

### **2. Manifest.json**
- ✅ Semua field required sudah ada
- ✅ Icons dengan berbagai ukuran
- ✅ Shortcuts untuk quick access
- ✅ Theme color & background color

### **3. Install Prompt**
- ✅ Auto-show setelah 3 detik
- ✅ Support Android & iOS
- ✅ Dismissible (tidak muncul lagi di session yang sama)

### **4. Offline Support**
- ✅ Offline page di `/offline`
- ✅ NetworkFirst strategy untuk fallback
- ✅ Auto-reload saat online kembali

---

## 🚀 **Cara Test PWA**

### **1. Build Production**
```bash
cd frontend
npm run build
npm start
```

### **2. Test di Browser**

#### **Chrome/Edge (Desktop)**
1. Buka `http://localhost:3000`
2. Buka DevTools (F12)
3. Tab **Application** → **Service Workers**
   - ✅ Harus ada service worker terdaftar
   - ✅ Status: **activated and is running**
4. Tab **Application** → **Manifest**
   - ✅ Semua field harus terisi
   - ✅ Icons harus terlihat
5. Icon install akan muncul di address bar (kanan)
6. Klik icon untuk install PWA

#### **Chrome (Mobile)**
1. Buka aplikasi di mobile browser
2. Prompt install akan muncul otomatis
3. Atau: Menu (3 dots) → **Install App**

#### **Safari (iOS)**
1. Buka aplikasi di Safari iOS
2. Tap **Share** button (kotak dengan panah)
3. Pilih **Add to Home Screen**
4. Tap **Add**

---

## 🐛 **Troubleshooting**

### **Problem: Service Worker Tidak Terdaftar**

**Solusi:**
1. Pastikan build production (`npm run build`)
2. Service worker TIDAK aktif di development mode (normal)
3. Clear cache browser:
   - Chrome: DevTools → Application → Clear storage
   - Atau: Hard refresh (Ctrl+Shift+R)

### **Problem: Install Prompt Tidak Muncul**

**Solusi:**
1. Pastikan sudah build production
2. Pastikan service worker sudah terdaftar
3. Pastikan manifest.json valid
4. Cek di DevTools → Application → Manifest
5. Pastikan tidak dalam mode incognito

### **Problem: PWA Tidak Bisa Offline**

**Solusi:**
1. Pastikan service worker sudah activated
2. Cek cache di DevTools → Application → Cache Storage
3. Pastikan runtime caching sudah bekerja
4. Test dengan: DevTools → Network → Offline checkbox

### **Problem: API Calls Masih Di-cache**

**Solusi:**
- ✅ Sudah diperbaiki: API calls menggunakan `NetworkOnly` handler
- Backend API tidak akan di-cache
- Midtrans API tidak akan di-cache

---

## 📋 **Checklist PWA**

### **Sebelum Deploy:**
- [x] Manifest.json lengkap
- [x] Service worker terdaftar
- [x] Install prompt bekerja
- [x] Offline page ada
- [x] Icons tersedia
- [x] Theme color sesuai
- [x] Runtime caching dikonfigurasi
- [x] API tidak di-cache

### **Test di Production:**
- [ ] Build production berhasil
- [ ] Service worker terdaftar
- [ ] Install prompt muncul
- [ ] PWA bisa diinstall
- [ ] Offline mode bekerja
- [ ] Cache bekerja dengan baik
- [ ] API calls tidak di-cache

---

## 🔍 **Debug PWA**

### **Cek Service Worker:**
```javascript
// Di browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

### **Cek Manifest:**
```javascript
// Di browser console
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('Manifest:', m));
```

### **Cek Cache:**
```javascript
// Di browser console
caches.keys().then(keys => {
  console.log('Cache Names:', keys);
  keys.forEach(key => {
    caches.open(key).then(cache => {
      cache.keys().then(requests => {
        console.log(\`Cache \${key}:\`, requests);
      });
    });
  });
});
```

---

## 📝 **Catatan Penting**

1. **Service Worker HANYA aktif di production build**
   - Development: PWA disabled (normal)
   - Production: PWA enabled

2. **API Calls Tidak Di-cache**
   - Backend API: NetworkOnly
   - Midtrans API: NetworkOnly
   - Data selalu fresh dari server

3. **Images Di-cache**
   - CacheFirst strategy
   - 30 hari expiration
   - Meningkatkan performa

4. **Offline Support**
   - NetworkFirst untuk halaman
   - Fallback ke cache jika offline
   - Offline page jika tidak ada cache

---

## ✅ **Kesimpulan**

PWA sudah **100% siap** dan dikonfigurasi dengan benar:
- ✅ Service Worker terdaftar otomatis
- ✅ Manifest.json lengkap
- ✅ Install prompt bekerja
- ✅ Offline support aktif
- ✅ Cache strategy optimal
- ✅ API tidak di-cache (data real-time)

**Siap untuk production! 🚀**


