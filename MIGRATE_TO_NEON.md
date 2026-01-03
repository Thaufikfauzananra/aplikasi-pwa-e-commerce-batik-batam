# 🚀 Panduan Migrasi Database ke Neon PostgreSQL

## 📋 Prerequisites

1. **Akun Neon** - Daftar di https://neon.tech (gratis)
2. **Node.js** - Versi 18+ terinstall
3. **Prisma CLI** - Akan diinstall otomatis

---

## 🔧 Step 1: Setup Neon Database

### 1.1 Buat Database di Neon

1. Login ke https://console.neon.tech
2. Klik **"Create Project"**
3. Isi:
   - **Project Name**: `batik-batam` (atau nama lain)
   - **Region**: Pilih yang terdekat (Singapore untuk Indonesia)
   - **PostgreSQL Version**: 15 atau 16
4. Klik **"Create Project"**

### 1.2 Dapatkan Connection String

1. Setelah project dibuat, klik **"Connection Details"**
2. Pilih **"Pooler"** (penting untuk serverless/Vercel)
3. Copy connection string, format:
   ```
   postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Simpan connection string ini untuk langkah berikutnya

---

## 🔧 Step 2: Setup Environment Variables

### 2.1 Backend Express

Buat file `.env` di folder `backend-express/`:

```bash
cd backend-express
```

Buat file `.env`:

```env
# Database (dari Neon console)
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/batik_batam?sslmode=require"

# JWT Secret (generate random)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-random-string"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# Environment
NODE_ENV="development"
PORT=3001
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.2 Frontend (Next.js)

Buat file `.env.local` di folder `frontend/`:

```env
# Database (sama dengan backend)
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/batik_batam?sslmode=require"

# JWT Secret (sama dengan backend)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-random-string"

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# API URL (untuk development)
NEXT_PUBLIC_API_URL="/api"
```

---

## 🔧 Step 3: Install Dependencies

### 3.1 Backend Express

```bash
cd backend-express
npm install
npx prisma generate
```

### 3.2 Frontend

```bash
cd frontend
npm install
npx prisma generate
```

---

## 🔧 Step 4: Run Migration

### 4.1 Migrate Backend Database

```bash
cd backend-express
npx prisma migrate dev --name init
```

Ini akan:
- ✅ Membuat tabel `User` dan `PasswordResetToken`
- ✅ Menambahkan indexes
- ✅ Setup schema database

### 4.2 Migrate Frontend Database (jika perlu)

```bash
cd frontend
npx prisma migrate dev --name init
```

**Note:** Frontend dan backend bisa share database yang sama, jadi cukup migrate salah satu saja.

---

## 🔧 Step 5: Verify Migration

### 5.1 Cek Database di Neon Console

1. Buka Neon Console
2. Klik **"SQL Editor"**
3. Jalankan query:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
4. Harus muncul:
   - `User`
   - `PasswordResetToken`
   - `_prisma_migrations`

### 5.2 Test Connection (Backend)

```bash
cd backend-express
node verify.js
```

Atau test manual:
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('✅ Database connected! User count:', count);
  prisma.$disconnect();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"
```

### 5.3 Test Connection (Frontend)

```bash
cd frontend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('✅ Database connected! User count:', count);
  prisma.$disconnect();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"
```

---

## 🔧 Step 6: Test API Endpoints

### 6.1 Start Backend (jika menggunakan backend Express)

```bash
cd backend-express
npm run dev
```

### 6.2 Start Frontend

```bash
cd frontend
npm run dev
```

### 6.3 Test Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "password_confirmation": "123456"
  }'
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Registrasi berhasil!",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "eyJhbGc..."
}
```

### 6.4 Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

---

## 🐛 Troubleshooting

### ❌ Error: "Can't reach database server"

**Penyebab:** Connection string salah atau database offline

**Solusi:**
1. Pastikan menggunakan **pooler endpoint** (bukan direct)
2. Pastikan `?sslmode=require` ada di akhir URL
3. Cek Neon console - database harus **Active**

### ❌ Error: "P1001: Can't reach database server"

**Penyebab:** Network issue atau firewall

**Solusi:**
1. Cek koneksi internet
2. Coba connection string langsung di Neon SQL Editor
3. Pastikan tidak ada firewall yang block

### ❌ Error: "P2002: Unique constraint failed"

**Penyebab:** Email sudah terdaftar

**Solusi:** Gunakan email lain atau hapus user yang sudah ada

### ❌ Error: "Prisma Client not generated"

**Solusi:**
```bash
npx prisma generate
```

### ❌ Migration Error

**Solusi:**
```bash
# Reset database (HATI-HATI: akan hapus semua data!)
npx prisma migrate reset

# Atau migrate ulang
npx prisma migrate dev --name init
```

---

## ✅ Checklist Migrasi

- [ ] Database Neon dibuat
- [ ] Connection string didapat (pooler endpoint)
- [ ] `.env` file dibuat di `backend-express/`
- [ ] `.env.local` file dibuat di `frontend/`
- [ ] JWT_SECRET di-generate
- [ ] Dependencies terinstall (`npm install`)
- [ ] Prisma Client di-generate (`npx prisma generate`)
- [ ] Migration berhasil (`npx prisma migrate dev`)
- [ ] Database tables terlihat di Neon console
- [ ] Test connection berhasil
- [ ] Test register berhasil
- [ ] Test login berhasil

---

## 📝 Catatan Penting

1. **Pooler vs Direct Connection:**
   - ✅ Gunakan **pooler** untuk production/Vercel
   - ❌ Jangan gunakan direct connection untuk serverless

2. **Connection String Format:**
   ```
   ✅ BENAR: postgresql://...@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require
   ❌ SALAH: postgresql://...@ep-xxx.region.aws.neon.tech/db
   ```

3. **Environment Variables:**
   - Backend dan Frontend bisa share database yang sama
   - JWT_SECRET harus sama di backend dan frontend
   - DATABASE_URL harus sama di backend dan frontend

4. **Security:**
   - Jangan commit `.env` file ke Git
   - Gunakan JWT_SECRET yang kuat (32+ bytes)
   - Rotate JWT_SECRET secara berkala

---

## 🎉 Selesai!

Setelah semua checklist selesai, database sudah siap digunakan. Anda bisa:

1. ✅ Register user baru
2. ✅ Login user
3. ✅ Deploy ke Vercel (dengan environment variables yang sama)

**Next Steps:**
- Deploy backend ke Vercel
- Deploy frontend ke Vercel
- Set environment variables di Vercel dashboard

