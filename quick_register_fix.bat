@echo off
REM Quick Fix untuk Error Registrasi
REM Jalankan: quick_register_fix.bat

echo 🔧 Quick Fix: Error Registrasi
echo ================================
echo.

REM 1. Cek backend directory
echo 1️⃣ Checking backend directory...
if not exist "backend-express" (
    echo ❌ backend-express folder not found!
    pause
    exit /b 1
)

cd backend-express

REM 2. Cek package.json
echo 2️⃣ Checking dependencies...
if not exist "package.json" (
    echo ❌ package.json not found!
    pause
    exit /b 1
)

REM 3. Install dependencies jika belum
if not exist "node_modules" (
    echo 3️⃣ Installing dependencies...
    call npm install
) else (
    echo 3️⃣ Dependencies already installed ✅
)

REM 4. Generate Prisma
echo 4️⃣ Generating Prisma Client...
call npx prisma generate

REM 5. Cek .env
echo 5️⃣ Checking environment variables...
if not exist ".env" (
    echo ⚠️ .env not found, copying from .env.example...
    copy .env.example .env
    echo ⚠️ EDIT .env FILE WITH YOUR DATABASE_URL AND JWT_SECRET!
    echo    1. Get DATABASE_URL from: https://neon.tech/
    echo    2. Set JWT_SECRET to random 32-char string
)

REM 6. Summary
echo.
echo ✅ Setup Complete!
echo.
echo 📝 Next Steps:
echo    1. Edit .env with DATABASE_URL ^& JWT_SECRET
echo    2. Run: npm run dev
echo    3. Backend should run at http://localhost:3001
echo.
echo 🧪 Test:
echo    curl http://localhost:3001/api/health
echo.
pause
