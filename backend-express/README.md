# Express Backend for Batik Batam E-Commerce PWA

Express.js backend compatible with Vercel, replacing Laravel backend.

## Features

- ✅ JWT Authentication (replaces Laravel Sanctum)
- ✅ User Registration & Login
- ✅ Google OAuth Integration
- ✅ Password Management
- ✅ PostgreSQL Database (Neon)
- ✅ CORS Enabled
- ✅ Vercel Ready

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Environment Variables
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/batik_batam"
JWT_SECRET="your-super-secret-jwt-key"
GOOGLE_CLIENT_ID="your-google-client-id"
NODE_ENV="development"
PORT=3001
```

### 4. Local Development
```bash
npm run dev
```

## API Endpoints

### Public Routes
- `GET /api/hello` - Health check
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/login-with-google` - Login with Google

### Protected Routes (Requires JWT Token)
- `GET /api/me` - Get current user
- `POST /api/logout` - Logout
- `PUT /api/change-password` - Change password

## Deployment to Vercel

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Connect to Vercel
Visit https://vercel.com/new and select the repository

### 3. Add Environment Variables
In Vercel Project Settings → Environment Variables:
- `DATABASE_URL` - Neon PostgreSQL URL
- `JWT_SECRET` - Your secret key
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID

### 4. Deploy
```bash
vercel --prod
```

## Database Schema (Prisma)

### User Model
```prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String
  password  String
  role      String  @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Request/Response Examples

### Register
**Request:**
```json
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Registrasi berhasil!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**Request:**
```json
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Login berhasil!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Frontend Integration

Update your frontend API base URL:

```javascript
// From:
const API_URL = 'https://your-render-backend.com/api';

// To:
const API_URL = 'https://your-vercel-backend.com/api';
```

All endpoints return same response format as Laravel backend ✅

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct (includes connection pooling settings for Neon)
- Check Vercel Environment Variables

### Token Not Working
- Ensure `JWT_SECRET` is set in production
- Token expires after 7 days

### CORS Issues
- CORS is enabled for all origins by default
- Modify in `src/index.js` if needed
