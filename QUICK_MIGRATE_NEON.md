# ⚡ Quick Start: Migrasi Database ke Neon

## 🎯 Langkah Cepat (5 Menit)

### 1. Buat Database di Neon (2 menit)

1. Buka https://console.neon.tech
2. Login/Register (gratis)
3. Klik **"Create Project"**
4. Isi:
   - Name: `batik-batam`
   - Region: `Singapore` (terdekat)
   - PostgreSQL: `15` atau `16`
5. Klik **"Create Project"**

### 2. Dapatkan Connection String (1 menit)

1. Setelah project dibuat, klik **"Connection Details"**
2. Pilih tab **"Pooler"** (penting!)
3. Copy connection string, contoh:
   ```
   postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Setup Environment Variables (1 menit)

#### Backend Express

Buat file `backend-express/.env`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="generate-random-string-here"
NODE_ENV="development"
PORT=3001
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend

Buat file `frontend/.env.local`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="sama-dengan-backend"
NEXT_PUBLIC_API_URL="/api"
```

### 4. Install & Migrate (1 menit)

#### Backend

```bash
cd backend-express
npm install
npx prisma generate
npx prisma migrate dev --name init
```

#### Frontend

```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

**Note:** Cukup migrate salah satu saja (backend atau frontend), karena share database yang sama.

### 5. Test (30 detik)

```bash
# Test connection
cd backend-express
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('✅ Connected! Users:', count);
  prisma.\$disconnect();
});
"
```

## ✅ Selesai!

Database sudah siap digunakan. Anda bisa:

1. ✅ Register user baru
2. ✅ Login user
3. ✅ Deploy ke Vercel

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Fix:**
- Pastikan menggunakan **pooler endpoint** (ada kata "pooler")
- Pastikan ada `?sslmode=require` di akhir URL
- Cek database status di Neon console

### Error: "P1001"

**Fix:**
- Cek koneksi internet
- Coba connection string di Neon SQL Editor
- Pastikan database **Active** di Neon console

### Error: "Prisma Client not generated"

**Fix:**
```bash
npx prisma generate
```

---

## 📝 Checklist

- [ ] Database Neon dibuat
- [ ] Connection string didapat (pooler)
- [ ] `.env` dibuat di backend-express
- [ ] `.env.local` dibuat di frontend
- [ ] JWT_SECRET di-generate
- [ ] `npm install` di backend
- [ ] `npm install` di frontend
- [ ] `npx prisma generate` di backend
- [ ] `npx prisma migrate dev` di backend
- [ ] Test connection berhasil

---

## 🚀 Next Steps

Setelah migrasi selesai:

1. Test register/login di frontend
2. Deploy ke Vercel
3. Set environment variables di Vercel dashboard

**Selamat! Database sudah terhubung ke Neon! 🎉**

