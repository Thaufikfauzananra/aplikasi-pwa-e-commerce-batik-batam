#!/bin/bash

# Setup script for Express Backend

echo "📦 Installing dependencies..."
npm install

echo "🔑 Setting up Prisma..."
npx prisma generate

echo "📝 Creating .env file from .env.example..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Edit .env file with your database credentials"
fi

echo "🗄️  Running Prisma migrations..."
npx prisma migrate dev --name init

echo "✅ Setup complete! Start with: npm run dev"
