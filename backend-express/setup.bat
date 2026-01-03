@echo off
REM Setup script for Express Backend (Windows)

echo 📦 Installing dependencies...
call npm install

echo 🔑 Setting up Prisma...
call npx prisma generate

echo 📝 Creating .env file from .env.example...
if not exist .env (
  copy .env.example .env
  echo ⚠️  Edit .env file with your database credentials
)

echo 🗄️  Running Prisma migrations...
call npx prisma migrate dev --name init

echo ✅ Setup complete! Start with: npm run dev
pause
