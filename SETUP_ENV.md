# 🔧 Setup Environment Variables untuk Neon

## ✅ Connection String yang Sudah Disediakan

```
postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 📝 Langkah Setup

### 1. Backend Express - Buat File `.env`

Buat file `backend-express/.env` dengan isi:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""

# Environment
NODE_ENV="development"
PORT=3001
```

**Cara membuat:**
```bash
# Windows (PowerShell)
cd backend-express
@"
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"
NODE_ENV="development"
PORT=3001
"@ | Out-File -FilePath .env -Encoding utf8

# Linux/Mac
cd backend-express
cat > .env << 'EOF'
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"
NODE_ENV="development"
PORT=3001
EOF
```

### 2. Frontend - Buat File `.env.local`

Buat file `frontend/.env.local` dengan isi:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret (SAMA dengan backend)
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""

# API URL
NEXT_PUBLIC_API_URL="/api"
```

**Cara membuat:**
```bash
# Windows (PowerShell)
cd frontend
@"
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"
NEXT_PUBLIC_API_URL="/api"
"@ | Out-File -FilePath .env.local -Encoding utf8

# Linux/Mac
cd frontend
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"
NEXT_PUBLIC_API_URL="/api"
EOF
```

## 🚀 Langkah Selanjutnya

### 1. Install Dependencies

```bash
# Backend
cd backend-express
npm install
npx prisma generate

# Frontend
cd frontend
npm install
npx prisma generate
```

### 2. Run Migration

```bash
# Backend (cukup salah satu)
cd backend-express
npx prisma migrate dev --name init
```

### 3. Test Connection

```bash
# Backend
cd backend-express
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.user.count().then(c => {console.log('✅ Connected! Users:', c); p.\$disconnect();}).catch(e => {console.error('❌ Error:', e.message); process.exit(1);});"
```

## ✅ Checklist

- [ ] File `backend-express/.env` dibuat
- [ ] File `frontend/.env.local` dibuat
- [ ] `npm install` di backend
- [ ] `npm install` di frontend
- [ ] `npx prisma generate` di backend
- [ ] `npx prisma generate` di frontend
- [ ] `npx prisma migrate dev` di backend
- [ ] Test connection berhasil

## 🎉 Selesai!

Setelah semua langkah selesai, database sudah terhubung ke Neon dan siap digunakan!

