# 🚀 FIX CORS ERROR - QUICK ACTION PLAN

## ⚠️ Current Issue
```
CORS Error: No 'Access-Control-Allow-Origin' header
```

**Root Cause**: Frontend `.env.production` not updated before build (sudah fixed, tinggal rebuild)

---

## ✅ Fix (2 Steps)

### Step 1: Push Code to GitHub
```bash
cd C:\aplikasi-pwa-e-commerce-batik-batam
git add -A
git commit -m "Fix: Update backend API URL in .env.production"
git push origin main
```

### Step 2: Vercel Rebuilds Automatically
- Vercel mendeteksi push
- Frontend rebuild dengan env variables baru
- Deployment selesai (1-2 menit)

---

## 🔄 Alternative: Manual Rebuild

Jika tidak ingin push, trigger manual rebuild:

1. Go to: https://vercel.com/dashboard
2. Click: `aplikasi-pwa-e-commerce-batik-batam-mu` (frontend project)
3. Go to: Deployments tab
4. Find latest deployment
5. Click "..." menu → "Redeploy"
6. Wait untuk "Ready" status

---

## 🧪 After Rebuild, Test:

1. Open: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app/register
2. Open DevTools (F12) → Console
3. Try register
4. Should see in console:
   ```
   📤 Sending register request: {
     api_url: "https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api"
   }
   ```
5. ✅ CORS error gone!

---

## 🔍 Why This Happened

**Timeline**:
1. ✅ `.env.production` file updated dengan URL benar
2. ❌ Tapi Vercel frontend build masih menggunakan old value dari cache
3. ✅ Solution: Rebuild frontend untuk menggunakan env variable terbaru

---

## 📋 Verification

After rebuild complete:

| Check | Expected |
|-------|----------|
| Frontend URL | https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app |
| Backend URL in code | https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api |
| CORS Header | Present (✅) |
| Register works | ✅ Yes |

---

## 💡 Key Point

**Environment variables di Vercel perlu rebuild untuk aktif!**

Setiap kali ubah `.env.production` atau set env var di Vercel, perlu trigger rebuild agar aplikasi menggunakan nilai terbaru.

---

**Next**: Push code atau trigger rebuild, tunggu ~2 menit, then test! ✅
