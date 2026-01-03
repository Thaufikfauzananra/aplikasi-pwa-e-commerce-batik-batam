# PowerShell Script untuk Setup Environment Variables
# Jalankan: .\setup-env.ps1

Write-Host "🔧 Setting up environment variables..." -ForegroundColor Cyan

# Backend .env
$backendEnv = @"
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""

# Environment
NODE_ENV="development"
PORT=3001
"@

# Frontend .env.local
$frontendEnv = @"
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret (SAMA dengan backend)
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""

# API URL
NEXT_PUBLIC_API_URL="/api"
"@

# Create backend .env
if (Test-Path "backend-express\.env") {
    Write-Host "⚠️  backend-express\.env already exists, skipping..." -ForegroundColor Yellow
} else {
    $backendEnv | Out-File -FilePath "backend-express\.env" -Encoding utf8
    Write-Host "✅ Created backend-express\.env" -ForegroundColor Green
}

# Create frontend .env.local
if (Test-Path "frontend\.env.local") {
    Write-Host "⚠️  frontend\.env.local already exists, skipping..." -ForegroundColor Yellow
} else {
    $frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding utf8
    Write-Host "✅ Created frontend\.env.local" -ForegroundColor Green
}

Write-Host "`n✅ Environment files created!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. cd backend-express && npm install && npx prisma generate" -ForegroundColor White
Write-Host "   2. cd frontend && npm install && npx prisma generate" -ForegroundColor White
Write-Host "   3. cd backend-express && npx prisma migrate dev --name init" -ForegroundColor White

