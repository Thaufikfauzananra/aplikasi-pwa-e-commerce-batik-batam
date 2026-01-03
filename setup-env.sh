#!/bin/bash
# Bash Script untuk Setup Environment Variables
# Jalankan: chmod +x setup-env.sh && ./setup-env.sh

echo "🔧 Setting up environment variables..."

# Backend .env
if [ -f "backend-express/.env" ]; then
    echo "⚠️  backend-express/.env already exists, skipping..."
else
    cat > backend-express/.env << 'EOF'
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""

# Environment
NODE_ENV="development"
PORT=3001
EOF
    echo "✅ Created backend-express/.env"
fi

# Frontend .env.local
if [ -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local already exists, skipping..."
else
    cat > frontend/.env.local << 'EOF'
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_drfijXmxYQ71@ep-polished-salad-a1u18ecf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secret (SAMA dengan backend)
JWT_SECRET="f8bc2a0e1fd2a0235f0128107bfb0c902f9b5d27890604070356c9539d3ff756"

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""

# API URL
NEXT_PUBLIC_API_URL="/api"
EOF
    echo "✅ Created frontend/.env.local"
fi

echo ""
echo "✅ Environment files created!"
echo ""
echo "📝 Next steps:"
echo "   1. cd backend-express && npm install && npx prisma generate"
echo "   2. cd frontend && npm install && npx prisma generate"
echo "   3. cd backend-express && npx prisma migrate dev --name init"

