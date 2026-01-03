# 🧪 INTEGRATION TEST & FIX

## ❌ Current Status
```
Frontend: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app
Backend: https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app
Error: "Tidak bisa terhubung ke backend"
```

---

## ✅ COMPLETE FIX (Step by Step)

### Phase 1: Verify Code (DONE ✅)

**Frontend**:
- ✅ `lib/axios.js` - Using `NEXT_PUBLIC_API_URL` env variable
- ✅ `.env.production` - Updated to `https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api`
- ✅ `app/register/page.js` - Has proper error handling & logging

**Backend**:
- ✅ `src/index.js` - CORS enabled (origin: '*')
- ✅ `src/routes/auth.js` - Register endpoint exists
- ✅ `.env` - Has DATABASE_URL & JWT_SECRET
- ✅ `vercel.json` - Vercel config present

**Code Status**: ✅ **ALL CORRECT**

---

### Phase 2: Trigger Vercel Rebuilds

#### Frontend Rebuild
1. Go to: https://vercel.com/dashboard
2. Click: `aplikasi-pwa-e-commerce-batik-batam-mu`
3. Go to: **Deployments**
4. Find: Latest deployment
5. Click: **"..."** button
6. Select: **"Redeploy"**
7. Wait: 2-3 minutes for "✅ Ready" status

#### Backend Rebuild
1. Go to: https://vercel.com/dashboard
2. Click: `aplikasi-pwa-e-commerce-batik-batam-aflqg23kf`
3. Go to: **Deployments**
4. Find: Latest deployment
5. Click: **"..."** button
6. Select: **"Redeploy"**
7. Wait: 2-3 minutes for "✅ Ready" status

---

### Phase 3: Verify Deployments

#### Check Deployment Logs

**Frontend Logs**:
1. Click frontend deployment → **Logs** tab
2. Look for: "Build successful" ✅
3. Should NOT see: Build errors ❌

**Backend Logs**:
1. Click backend deployment → **Logs** tab
2. Look for: "Server running" ✅
3. Should NOT see: Connection errors ❌

#### Check Environment Variables

**Frontend (Vercel Settings)**:
```
Go to: Settings → Environment Variables
Should have:
  NEXT_PUBLIC_API_URL=https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=... (if using OAuth)
```

**Backend (Vercel Settings)**:
```
Go to: Settings → Environment Variables
Should have:
  DATABASE_URL=postgresql://... (from Neon)
  JWT_SECRET=your-secret-key
  NODE_ENV=production
  PORT=3001
```

---

### Phase 4: Test API Endpoints

#### Test 1: Backend Health Check
```bash
curl https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/health

# Expected response (200):
# {
#   "status": "success",
#   "message": "Backend is healthy",
#   "database": "connected"
# }
```

#### Test 2: Backend Hello
```bash
curl https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/hello

# Expected response (200):
# {
#   "message": "Halo dari Express Backend! 🎉",
#   "status": "success"
# }
```

#### Test 3: Frontend API URL (Browser Console)
```javascript
// Open: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app/register
// Press: F12 (DevTools)
// Console tab, paste:

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

// OR look for existing log:
// Should see: "📤 Sending register request: { api_url: "https://..." }"
```

#### Test 4: Register Endpoint
```javascript
// In browser console:
fetch('https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    password: 'test123456',
    password_confirmation: 'test123456'
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))
```

---

### Phase 5: End-to-End Test

1. **Open Frontend**: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app/register
2. **Open DevTools**: F12 → Console tab
3. **Fill Form**:
   ```
   Name: Test Integration
   Email: test-integration@example.com
   Password: Test@123456
   Confirm: Test@123456
   Agree: ✓
   ```
4. **Click Register**
5. **Check Console** for:
   ```
   ✅ "📤 Sending register request: ..."
   ✅ "✅ Register success: ..."
   ✅ Token saved
   ✅ Redirect to /Beranda
   ```
6. **If successful**: Integration is working! 🎉
7. **If error**: Check logs per Phase 2 troubleshooting

---

## 🚨 If Still Not Working

### Problem: Backend Health Check Fails

**Symptoms**:
```
curl https://...vercel.app/api/health
→ 502 Bad Gateway
→ Connection timeout
```

**Solution**:
1. Check backend Vercel logs for errors
2. Look for: "DATABASE_URL", "CONNECTION", "ERROR"
3. If database error:
   - Go to Neon.tech console
   - Verify database is running
   - Copy fresh DATABASE_URL
   - Update in Vercel environment variables
   - Redeploy backend

### Problem: Frontend Shows Wrong API URL

**Symptoms**:
```javascript
// Console shows:
api_url: "http://127.0.0.1:3001/api"  // Wrong! (development)
// Or shows old backend URL
```

**Solution**:
1. Frontend not rebuilt with new env variable
2. Redeploy frontend again
3. Wait 2-3 minutes
4. Hard refresh browser (Ctrl+Shift+R)
5. Check console again

### Problem: CORS Error Still Appears

**Symptoms**:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**:
1. Verify backend CORS config (it's correct ✅)
2. Check if request reaching correct backend URL
3. Try from incognito/private window
4. Check backend logs for actual request hits

---

## 📝 Checklist

Before declaring "Integration Complete":

- [ ] Frontend Vercel shows "✅ Ready"
- [ ] Backend Vercel shows "✅ Ready"
- [ ] Health check returns 200 ✅
- [ ] API URL in frontend is correct
- [ ] CORS errors gone
- [ ] Can submit register form
- [ ] No console errors (red)
- [ ] Token saved to localStorage
- [ ] Redirect to /Beranda works
- [ ] Can login with test account

---

## 🎯 Summary

**Current State**:
- Code: ✅ Correct
- Config: ✅ Updated
- Deployments: ⏳ Rebuilding

**What to do NOW**:
1. Trigger Vercel rebuilds (both frontend & backend)
2. Wait 2-3 minutes for deployments
3. Verify in Vercel dashboard (both show "Ready")
4. Run Phase 4 tests
5. Try register
6. Should work! ✅

**Status**: Following this guide will fix the integration!
