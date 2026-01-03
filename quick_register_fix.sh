#!/bin/bash
# Quick Fix untuk Error Registrasi
# Jalankan: bash quick_register_fix.sh

echo "🔧 Quick Fix: Error Registrasi"
echo "================================"
echo ""

# 1. Cek backend directory
echo "1️⃣ Checking backend directory..."
if [ ! -d "backend-express" ]; then
    echo "❌ backend-express folder not found!"
    exit 1
fi

cd backend-express

# 2. Cek package.json
echo "2️⃣ Checking dependencies..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# 3. Install dependencies jika belum
if [ ! -d "node_modules" ]; then
    echo "3️⃣ Installing dependencies..."
    npm install
else
    echo "3️⃣ Dependencies already installed ✅"
fi

# 4. Generate Prisma
echo "4️⃣ Generating Prisma Client..."
npx prisma generate

# 5. Cek .env
echo "5️⃣ Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️ .env not found, copying from .env.example..."
    cp .env.example .env
    echo "⚠️ EDIT .env FILE WITH YOUR DATABASE_URL AND JWT_SECRET!"
    echo "   1. Get DATABASE_URL from: https://neon.tech/"
    echo "   2. Set JWT_SECRET to random 32-char string"
fi

# 6. Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Edit .env with DATABASE_URL & JWT_SECRET"
echo "   2. Run: npm run dev"
echo "   3. Backend should run at http://localhost:3001"
echo ""
echo "🧪 Test:"
echo "   curl http://localhost:3001/api/health"
echo ""
