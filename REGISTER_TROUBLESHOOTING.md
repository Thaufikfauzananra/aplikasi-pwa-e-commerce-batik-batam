# 🔧 Troubleshooting Guide: Error Registrasi

## ❌ Error: "Registrasi gagal! Tidak bisa terhubung ke backend"

### Penyebab
Backend Express tidak running atau tidak bisa diakses

### Solusi
```bash
# 1. Buka terminal baru
cd backend-express

# 2. Install dependencies (jika belum)
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Pastikan .env sudah ada
# Copy dari .env.example jika belum ada
cp .env.example .env

# 5. Edit .env - pastikan DATABASE_URL dan JWT_SECRET ada
# Gunakan Neon Database: https://neon.tech/
# DATABASE_URL="postgresql://..."

# 6. Jalankan backend
npm run dev

# Harusnya output:
# 🚀 Server running at http://localhost:3001
```

---

## ❌ Error: "Registrasi gagal! Validation failed"

Beberapa kemungkinan:

### 1. **name: The name field is required**
- Nama kosong atau tidak valid
- **Solusi**: Masukkan nama lengkap

### 2. **email: The email must be a valid email address**
- Email format salah (misal: `user@` atau `user.com`)
- **Solusi**: Gunakan format valid: `user@example.com`

### 3. **password: The password must be at least 6 characters**
- Password kurang dari 6 karakter
- **Solusi**: Buat password minimal 6 karakter

### 4. **password_confirmation: The password confirmation does not match**
- Password & confirm password tidak sama
- **Solusi**: Pastikan kedua password sama

### 5. **email: Email sudah terdaftar**
- Email sudah digunakan user lain
- **Solusi**: Gunakan email baru atau login dengan email yang sudah ada

---

## ❌ Error: "Terjadi kesalahan server"

### Database Connection Error

**Cek di console backend**:
```
Error: Client was closed
Error: getaddrinfo ENOTFOUND
Error: password authentication failed
```

**Solusi**:
```bash
# 1. Verifikasi DATABASE_URL di .env
cat .env | grep DATABASE_URL

# 2. Verifikasi format:
# postgresql://user:password@host:port/database?sslmode=require

# 3. Test koneksi database
npx prisma db push

# 4. Jika error, reset database
npx prisma migrate reset --force

# 5. Jalankan ulang backend
npm run dev
```

---

## ❅ Frontend Error Checklist

### 1. **API URL Salah**
```javascript
// frontend/lib/axios.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api";
// Seharusnya pointing ke backend Express di port 3001
```

**Verifikasi**:
```bash
# Buka frontend .env.local
cat .env.local | grep NEXT_PUBLIC_API_URL

# Seharusnya:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api
```

### 2. **Frontend Belum Restart**
```bash
# Hentikan frontend
Ctrl + C

# Jalankan ulang
npm run dev
```

### 3. **CORS Error**
**Error di browser console**:
```
Access to XMLHttpRequest at 'http://127.0.0.1:3001/api/register' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solusi** - Backend sudah configure CORS untuk all origins:
```javascript
// backend-express/src/index.js
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

Jika masih error, cek:
1. Backend betul-betul running
2. Request headers valid
3. Browser console untuk detail error

---

## 🔍 Debug Mode

### Enable Detailed Logging

**Backend**:
```bash
# Jalankan dengan debug mode
DEBUG=* npm run dev

# Atau set NODE_ENV
NODE_ENV=development npm run dev
```

**Frontend** - Sudah ada logging:
```javascript
// Buka browser DevTools (F12)
// Console tab akan menampilkan:
// 📤 Sending register request...
// ✅ Register success...
// ❌ Register gagal...
```

---

## 📋 Checklist Sebelum Debug

- [ ] Backend running di `http://127.0.0.1:3001`
- [ ] Database connected (test: `npx prisma db push`)
- [ ] `.env` punya `DATABASE_URL` & `JWT_SECRET`
- [ ] Frontend punya `.env.local` dengan `NEXT_PUBLIC_API_URL`
- [ ] Frontend sudah restart setelah edit .env
- [ ] Browser console clear dari error sebelumnya
- [ ] Network tab di DevTools jalan untuk melihat request/response

---

## 🧪 Test Manual

### Test Backend Langsung (tanpa Frontend)

```bash
# 1. Test health check
curl http://localhost:3001/api/health

# 2. Test register
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# 3. Harusnya response 201 dengan token
```

### Test Frontend Axios

**Buka browser console dan jalankan**:
```javascript
import api from './lib/axios.js';

// Test register
api.post('/register', {
  name: 'Test',
  email: 'test@email.com',
  password: 'test123',
  password_confirmation: 'test123'
})
.then(res => console.log('✅ Success:', res.data))
.catch(err => console.error('❌ Error:', err.response?.data || err.message));
```

---

## 📞 Masih Error?

Kumpulkan informasi ini:

1. **Exact error message** (dari alert/console)
2. **Backend console output** saat register
3. **Network tab** (request/response detail)
4. **Environment**:
   - OS: Windows/Mac/Linux
   - Node version: `node -v`
   - npm version: `npm -v`
   - Database: Neon/Local/Other

Kemudian cek logs di browser DevTools Network tab untuk response detail.
