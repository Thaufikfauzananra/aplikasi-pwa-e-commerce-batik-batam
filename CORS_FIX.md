# 🔧 CORS FIX - REBUILD REQUIRED

## ❌ Error Found

```
Access to XMLHttpRequest at 'https://aplikasi-pwa-e-commerce-batik-batam.vercel.app/api/register'
from origin 'https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app'
```

**Problem**: Frontend masih pakai backend URL yang LAMA!

---

## ✅ Solution

### Step 1: Push Code Changes
```bash
cd your-project
git add .
git commit -m "Fix: Update backend API URL to correct Vercel deployment"
git push origin main
```

### Step 2: Vercel Auto Rebuild
Frontend akan otomatis rebuild dengan env variables yang benar.

**OR Trigger Manual Rebuild**:
1. Go to: https://vercel.com/dashboard
2. Select: `aplikasi-pwa-e-commerce-batik-batam-mu`
3. Click: Deployments
4. Find latest deployment
5. Click: "Redeploy"

### Step 3: Wait for Deployment
- Should take 1-2 minutes
- Check status in Vercel dashboard
- Once "Ready", test again

---

## ✅ Verification

After rebuild, open browser DevTools (F12) → Console and look for:
```
📤 Sending register request: {
  api_url: "https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api"
}
```

If you see the correct URL, CORS should work now!

---

## 🔍 What Changed

### Before ❌
```
Frontend API URL: https://aplikasi-pwa-e-commerce-batik-batam.vercel.app/api (WRONG)
Backend URL: https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app
Result: CORS Error
```

### After ✅
```
Frontend API URL: https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api (CORRECT)
Backend URL: https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app
Result: Works!
```

---

## 📋 Backend CORS Check

Backend Express sudah punya CORS enabled:
```javascript
// src/index.js
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

Jadi setelah frontend di-rebuild, CORS akan work! ✅

---

## 🧪 Test After Rebuild

1. Wait for Vercel to finish deployment (green "Ready" status)
2. Open: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app/register
3. Try register
4. Should work now! ✅

---

**Status**: Frontend perlu rebuild dengan env variables baru
**Action**: Push code atau trigger manual rebuild di Vercel
**ETA**: 1-2 minutes
