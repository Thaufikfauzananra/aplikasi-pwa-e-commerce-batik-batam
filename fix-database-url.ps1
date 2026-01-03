# Script untuk memperbaiki DATABASE_URL di .env
# Jalankan: .\fix-database-url.ps1

$correctUrl = "postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Write-Host "🔧 Memperbaiki DATABASE_URL..." -ForegroundColor Cyan

# Backend .env
if (Test-Path "backend-express\.env") {
    $content = Get-Content "backend-express\.env" -Raw
    $content = $content -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$correctUrl`""
    $content | Set-Content "backend-express\.env" -NoNewline
    Write-Host "✅ backend-express\.env sudah diperbaiki" -ForegroundColor Green
} else {
    Write-Host "❌ File backend-express\.env tidak ditemukan" -ForegroundColor Red
}

# Frontend .env.local
if (Test-Path "frontend\.env.local") {
    $content = Get-Content "frontend\.env.local" -Raw
    $content = $content -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$correctUrl`""
    $content | Set-Content "frontend\.env.local" -NoNewline
    Write-Host "✅ frontend\.env.local sudah diperbaiki" -ForegroundColor Green
} else {
    Write-Host "❌ File frontend\.env.local tidak ditemukan" -ForegroundColor Red
}

Write-Host "`n✅ Selesai! Connection string sudah diperbaiki." -ForegroundColor Green
Write-Host "`n📝 Sekarang jalankan migrasi:" -ForegroundColor Cyan
Write-Host "   cd backend-express" -ForegroundColor White
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor White

