# 🚀 PRODUCTION DEPLOYMENT GUIDE

## ✅ Status: LIVE!

**Frontend**: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app
**Backend**: https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app

---

## 📋 Environment Variables Setup

### Frontend (.env.production)

✅ **Updated** - Now pointing to Express backend:
```
NEXT_PUBLIC_API_URL=https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api
```

### Backend (Vercel Environment Variables)

Pastikan di Vercel backend settings ada:
```
DATABASE_URL=postgresql://...  (dari Neon.tech)
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3001
```

---

## 🧪 Testing Production

### 1. Test Health Check
```bash
curl https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Backend is healthy",
  "database": "connected"
}
```

### 2. Test Register
1. Buka: https://aplikasi-pwa-e-commerce-batik-batam-mu.vercel.app/register
2. Isi form dengan data valid
3. Click Register
4. Seharusnya berhasil & redirect ke Beranda

### 3. Browser Console Check (F12)
```
✅ Status 201 Created
✅ Token saved to localStorage
✅ Redirect successful
```

---

## ⚙️ Configuration Checklist

### Backend (Express)

- [ ] DATABASE_URL set di Vercel environment
- [ ] JWT_SECRET set di Vercel environment
- [ ] CORS enabled (all origins)
- [ ] NODE_ENV=production
- [ ] All dependencies installed
- [ ] Prisma Client generated
- [ ] Health check working

### Frontend (Next.js)

- [ ] .env.production dengan correct API URL
- [ ] .env.local untuk development (localhost:3001)
- [ ] GOOGLE_CLIENT_ID set (jika pakai OAuth)
- [ ] Build successful: `npm run build`
- [ ] No console errors in browser
- [ ] API calls reaching correct backend

---

## 🔐 Security Checklist

### CORS & API Security
- [ ] CORS configured untuk production domains
- [ ] JWT_SECRET strong & unique
- [ ] Database password secured
- [ ] No sensitive data in client code
- [ ] HTTPS enabled (default di Vercel)
- [ ] No API keys in git

### Environment Variables
- [ ] DATABASE_URL not in .env file (only in Vercel)
- [ ] JWT_SECRET not in .env file (only in Vercel)
- [ ] .env.local in .gitignore
- [ ] .env.production in git (template values only)

---

## 📊 Monitoring

### Check Logs

**Backend** (Vercel Dashboard):
1. Go to: https://vercel.com/dashboard
2. Select: aplikasi-pwa-e-commerce-batik-batam-aflqg23kf
3. View: Logs
4. Look for: `[REGISTER]` entries, errors, database issues

**Frontend** (Vercel Dashboard):
1. Go to: https://vercel.com/dashboard
2. Select: aplikasi-pwa-e-commerce-batik-batam-mu
3. View: Logs
4. Look for: API errors, CORS issues, build warnings

### Error Tracking

**If registration fails:**
1. Check browser console (F12)
2. Check backend logs in Vercel
3. Verify API URL in frontend
4. Check database connection
5. Verify JWT_SECRET set in backend

---

## 🔄 Deployment Process

### After Code Changes

**Backend**:
1. Push to GitHub
2. Vercel auto-deploys
3. Check logs for errors
4. Test health check endpoint

**Frontend**:
1. Push to GitHub
2. Vercel auto-deploys
3. Check logs for build errors
4. Test in browser

---

## 🚨 Troubleshooting

### Problem: "Cannot connect to backend"

**Solution 1**: Check API URL
```javascript
// frontend/lib/axios.js
const API_URL = process.env.NEXT_PUBLIC_API_URL
console.log("API URL:", API_URL)
```

**Solution 2**: Verify backend health
```bash
curl https://aplikasi-pwa-e-commerce-batik-batam-aflqg23kf.vercel.app/api/health
```

**Solution 3**: Check CORS
```javascript
// backend-express/src/index.js
// Should have:
app.use(cors({
  origin: '*',  // or specific domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
```

### Problem: "Database connection failed"

**Solution**: Verify DATABASE_URL in Vercel
1. Go to Vercel Dashboard
2. Select backend project
3. Settings → Environment Variables
4. Check: DATABASE_URL exists and valid
5. Redeploy backend

### Problem: "Invalid JWT_SECRET"

**Solution**: Regenerate and update
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
1. Copy output
2. Go to Vercel → Settings → Environment Variables
3. Update JWT_SECRET
4. Redeploy backend

---

## 📞 Quick Reference

| Issue | Check |
|-------|-------|
| Register fails | Browser console (F12) + Backend logs |
| API 404 | Check NEXT_PUBLIC_API_URL in .env |
| API 500 | Check backend logs + DATABASE_URL |
| CORS error | Check origin in backend CORS config |
| Token not saved | Check browser localStorage |
| Redirect fails | Check frontend route permissions |

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Frontend accessible & loads correctly
- [ ] Backend health check working
- [ ] Can register new user
- [ ] Token saved to localStorage
- [ ] Can login with registered account
- [ ] Can logout & redirect to login
- [ ] No console errors in browser
- [ ] No errors in Vercel logs
- [ ] Database data persisting
- [ ] CORS working (no errors)
- [ ] Production environment variables set
- [ ] .env files not exposed in git

---

## 🎉 Deployment Complete!

Your application is now:
✅ **Live in production**
✅ **Accessible from internet**
✅ **Using Express backend (Express.js)**
✅ **Using PostgreSQL database (Neon)**
✅ **Secured with JWT authentication**
✅ **Ready for users**

---

**Next Steps:**
1. Share URL with users
2. Monitor logs for errors
3. Gather user feedback
4. Plan improvements

Enjoy! 🚀
