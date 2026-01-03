# Script untuk Update DATABASE_URL di .env
# Jalankan: .\update-db-url.ps1

$newDbUrl = "postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Write-Host "🔄 Updating DATABASE_URL in backend-express/.env..." -ForegroundColor Cyan

# Backend .env
if (Test-Path "backend-express\.env") {
    $content = Get-Content "backend-express\.env" -Raw
    $content = $content -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$newDbUrl`""
    $content | Set-Content "backend-express\.env" -NoNewline
    Write-Host "✅ Updated backend-express/.env" -ForegroundColor Green
} else {
    Write-Host "❌ File backend-express/.env tidak ditemukan!" -ForegroundColor Red
}

# Frontend .env.local
Write-Host "🔄 Updating DATABASE_URL in frontend/.env.local..." -ForegroundColor Cyan

if (Test-Path "frontend\.env.local") {
    $content = Get-Content "frontend\.env.local" -Raw
    $content = $content -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$newDbUrl`""
    $content | Set-Content "frontend\.env.local" -NoNewline
    Write-Host "✅ Updated frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "❌ File frontend/.env.local tidak ditemukan!" -ForegroundColor Red
}

Write-Host "`n✅ Connection string updated!" -ForegroundColor Green
Write-Host "`n📝 Sekarang jalankan migrasi:" -ForegroundColor Cyan
Write-Host "   cd backend-express" -ForegroundColor White
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor White

