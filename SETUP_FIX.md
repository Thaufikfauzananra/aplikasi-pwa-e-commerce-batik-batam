# 🚀 SETUP FIX: Error "Registrasi Gagal"

## ✅ Penyebab Utama
Error registrasi biasanya karena:
1. **Backend tidak running** ← PALING SERING
2. Database tidak connected
3. Environment variables salah
4. Frontend API URL salah

---

## 🎯 SOLUSI CEPAT (5 menit)

### Step 1: Backend Express Setup

```bash
# Terminal baru, CD ke project root
cd c:\path\to\aplikasi-pwa-e-commerce-batik-batam

# Masuk backend directory
cd backend-express

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### Step 2: Setup Environment

```bash
# Copy file template (jika belum ada .env)
cp .env.example .env

# Edit .env dengan text editor
# Buka: backend-express/.env
# Ganti:
#   DATABASE_URL = "..." (dari Neon.tech)
#   JWT_SECRET = "random-32-char-string"
#   PORT = 3001
```

**Get DATABASE_URL**:
1. Buka https://neon.tech/
2. Buat akun & database PostgreSQL
3. Copy connection string
4. Paste ke `DATABASE_URL` di .env

**Generate JWT_SECRET**:
```bash
# Terminal, jalankan:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output ke JWT_SECRET di .env
```

### Step 3: Jalankan Backend

```bash
# Di directory backend-express, jalankan:
npm run dev

# Seharusnya output:
# 🚀 Server running at http://localhost:3001
# [timestamp] GET /api/hello
```

### Step 4: Test Backend

**Buka browser atau terminal**:
```bash
# Test health check
curl http://localhost:3001/api/health

# Harusnya response:
# {
#   "status": "success",
#   "message": "Backend is healthy",
#   "database": "connected",
#   "totalUsers": 0,
#   "timestamp": "2026-01-03T..."
# }
```

### Step 5: Frontend Setup

Terminal baru:
```bash
# CD ke frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Jalankan frontend
npm run dev

# Seharusnya:
# ▲ Next.js 16.1.1
# - ready started server on 0.0.0.0:3000
```

### Step 6: Test Registration

1. Buka http://localhost:3000/register
2. Isi form:
   - Nama: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm: "password123"
   - Agree: ✓
3. Klik Register
4. Harusnya berhasil → redirect ke /Beranda

---

## 🔍 DEBUGGING

### Jika masih error, cek:

**1. Browser Console** (F12 → Console)
```
Harus ada log:
📤 Sending register request: {...}
✅ Register success: {...}
```

**2. Backend Console**
```
Harus ada log:
[REGISTER] Incoming request: {...}
[REGISTER] User created: {id: 1, email: "..."}
```

**3. Network Tab** (F12 → Network)
```
POST /register
Status: 201 (berhasil) atau 422/500 (error)
Response: lihat detail error
```

---

## ❌ Troubleshooting Common Errors

### Error: "Tidak bisa terhubung ke backend"
```
Penyebab: Backend tidak running di port 3001

Solusi:
1. Cek apakah terminal backend running
2. Verifikasi: http://localhost:3001/api/health
3. Jika 404, restart backend dengan: npm run dev
```

### Error: "Database connection failed"
```
Penyebab: DATABASE_URL tidak valid atau database offline

Solusi:
1. Verifikasi DATABASE_URL di .env
2. Test koneksi: npx prisma db push
3. Jika error, reset: npx prisma migrate reset --force
4. Atau buat database baru di Neon.tech
```

### Error: "email: Email sudah terdaftar"
```
Penyebab: Email sudah pernah diregister

Solusi:
1. Gunakan email berbeda
2. Atau reset database: npx prisma migrate reset --force
```

### Error: "password: The password must be at least 6 characters"
```
Penyebab: Password kurang dari 6 karakter

Solusi:
1. Gunakan password minimal 6 karakter
2. Contoh: password123, MyP@ssw0rd, 123456
```

---

## 🛠️ Setup Scripts (Optional)

### Windows
```bash
# Terminal Command Prompt:
quick_register_fix.bat
```

### Mac/Linux
```bash
# Terminal:
chmod +x quick_register_fix.sh
./quick_register_fix.sh
```

Scripts ini akan otomatis:
- Install dependencies
- Generate Prisma Client
- Setup .env (jika belum ada)

---

## 📋 Checklist Sebelum Production

- [ ] Backend running & accessible di port 3001
- [ ] Database connected (test dengan health check)
- [ ] Frontend running & accessible di port 3000
- [ ] Bisa register dengan data valid
- [ ] Token tersimpan di localStorage
- [ ] Bisa login dengan user baru
- [ ] Bisa logout & redirect ke login
- [ ] DevTools console tidak ada error

---

## 🎓 Understanding the Flow

```
User Input (Register Form)
    ↓
Frontend Validation (name, email, password match)
    ↓
API Request (POST http://localhost:3001/api/register)
    ↓
Backend Validation (email format, password length, etc)
    ↓
Database Check (email already exists?)
    ↓
Hash Password (bcryptjs)
    ↓
Create User (Prisma ORM)
    ↓
Generate JWT Token (7 days)
    ↓
Return Response (201 + token + user data)
    ↓
Frontend: Save token to localStorage
    ↓
Redirect to /Beranda
```

---

## 📞 Quick Support

**Jika masih error, kumpulkan:**

1. **Exact error message** (dari alert/console)
2. **Backend console output** (saat register attempt)
3. **Network response** (DevTools → Network → register request)
4. **Environment info**:
   - OS: Windows/Mac/Linux
   - Node version: `node -v`
   - npm version: `npm -v`

Kemudian baca [REGISTER_TROUBLESHOOTING.md](REGISTER_TROUBLESHOOTING.md) untuk solusi detail.

---

## ✅ Selesai!

Setelah setup ini, Anda sudah siap:
- ✅ Register user baru
- ✅ Login dengan credentials
- ✅ Google OAuth login
- ✅ Protected routes dengan JWT
- ✅ Deploy ke Vercel

Nikmati! 🚀
