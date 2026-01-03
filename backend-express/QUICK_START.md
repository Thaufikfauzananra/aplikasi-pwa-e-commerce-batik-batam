# 🚀 Quick Start: Express Backend untuk Vercel

## 5 Langkah Deploy dalam 30 Menit

### 1️⃣ Setup Lokal (5 menit)
```bash
cd backend-express
npm install
npx prisma generate
cp .env.example .env
```

### 2️⃣ Edit `.env` dengan Database URL
Dapatkan dari Neon:
```
DATABASE_URL="postgresql://user:password@ep-host.neon.tech/batik_batam?sslmode=require"
JWT_SECRET="rahasia-super-panjang-random"
GOOGLE_CLIENT_ID="dari-google-console"
```

### 3️⃣ Test Lokal
```bash
npm run dev
# Buka: http://localhost:3001/api/hello
# Response: {"message":"Halo dari Express Backend! 🎉","status":"success"}
```

### 4️⃣ Push ke GitHub
```bash
git add backend-express/
git commit -m "Add Express backend for Vercel"
git push origin main
```

### 5️⃣ Deploy ke Vercel

**Via Web:**
1. Buka https://vercel.com/new
2. Pilih GitHub repo
3. Framework Preset: **Node.js**
4. Root Directory: **`backend-express`**
5. Environment Variables:
   - `DATABASE_URL` = Neon URL
   - `JWT_SECRET` = Random string
   - `GOOGLE_CLIENT_ID` = Google ID
6. Deploy ✅

**Via CLI:**
```bash
cd backend-express
npm i -g vercel
vercel --prod
```

---

## ✅ Hasil Akhir

```
Frontend:  https://your-app.vercel.app       (Existing)
Backend:   https://your-api.vercel.app       (NEW Express)
Database:  postgresql://...neon.tech         (Existing)
```

---

## 🔄 Update Frontend

Edit `frontend/lib/axios.js`:

**Dari:**
```javascript
const API_BASE_URL = 'https://your-render-backend.com/api';
```

**Ke:**
```javascript
const API_BASE_URL = 'https://your-api.vercel.app/api';
```

Commit & push:
```bash
cd frontend
git add lib/axios.js
git commit -m "Update API URL to Express backend"
git push origin main
# Vercel auto-redeploy
```

---

## 🧪 Test APIs

### 1. Health Check
```bash
curl https://your-api.vercel.app/api/hello
```

### 2. Register
```bash
curl -X POST https://your-api.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Registrasi berhasil!",
  "user": {"id": 1, "name": "Test User", "email": "test@example.com", "role": "user"},
  "token": "eyJhbGc..."
}
```

### 3. Login
```bash
curl -X POST https://your-api.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Get Current User (Protected)
```bash
curl https://your-api.vercel.app/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 API Endpoints (Same as Laravel ✅)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/hello` | GET | ❌ | Health check |
| `/api/register` | POST | ❌ | Register user |
| `/api/login` | POST | ❌ | Login user |
| `/api/login-with-google` | POST | ❌ | Google OAuth |
| `/api/logout` | POST | ✅ | Logout |
| `/api/me` | GET | ✅ | Get current user |
| `/api/change-password` | PUT | ✅ | Change password |

---

## ⚙️ Environment Variables

| Variable | Source | Example |
|----------|--------|---------|
| `DATABASE_URL` | Neon console | `postgresql://...` |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | `a1b2c3d4...` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console | `123...apps.googleusercontent.com` |
| `NODE_ENV` | Auto | `production` |

---

## 🐛 Troubleshooting

### ❌ 502 Bad Gateway
```
Kemungkinan:
1. DATABASE_URL salah → Check Neon connection string
2. JWT_SECRET belum set → Add di Vercel env vars
3. Database offline → Check Neon console
```

### ❌ CORS Error di Frontend
```javascript
// Sudah di-config otomatis, tapi jika perlu adjust:
// Edit: src/index.js
app.use(cors({
  origin: '*',  // Change to: 'https://your-frontend.com'
}));
```

### ❌ Token Expired
```
JWT expires dalam 7 hari. Users perlu login lagi.
Untuk ubah: Edit src/routes/auth.js
jwt.sign(..., { expiresIn: '30d' })  // 30 hari
```

### ✅ Cek Logs
```
Vercel Dashboard → Deployments → Select deployment → Logs
```

---

## 📚 File Penting

| File | Purpose |
|------|---------|
| `src/index.js` | Main server & middleware |
| `src/routes/auth.js` | Auth endpoints (register, login, dll) |
| `src/middleware/auth.js` | JWT verification |
| `prisma/schema.prisma` | Database schema |
| `.env.example` | Template environment variables |
| `vercel.json` | Vercel configuration |

---

## 🎯 Next Steps

1. ✅ Setup lokal & test
2. ✅ Push ke GitHub
3. ✅ Deploy ke Vercel
4. ✅ Update frontend API URL
5. ✅ Test register/login di production
6. ✅ Monitor Vercel logs

---

## 💡 Tips

- Gunakan Neon **connection pooler** untuk Vercel (serverless):
  ```
  postgresql://...@ep-host-pooler.neon.tech/db
  ```

- JWT Token tidak disimpan di database (stateless) → More scalable

- Semua endpoint return same format sebagai Laravel → No frontend rewrite needed!

- Vercel free tier cukup untuk 100K users/month

---

## 📞 Help

**Stuck?** Baca:
1. `DEPLOYMENT.md` - Detail lengkap
2. `COMPARISON.md` - Laravel vs Express mapping
3. `README.md` - API documentation

**Tetap gunakan Laravel jika:**
- Tidak yakin dengan Express
- Perlu production fallback
- Tidak ingin risk eksperimen

**Express lebih baik untuk:**
- Budget terbatas (Vercel free)
- Scale otomatis
- Hosting di Vercel bersama frontend

Good luck! 🚀
