# Deployment Guide: Express Backend to Vercel

## Quick Start (5 minutes)

### 1. Local Setup
```bash
cd backend-express
npm install
npx prisma generate
cp .env.example .env
# Edit .env with Neon database URL and JWT secret
```

### 2. Test Locally
```bash
npm run dev
# Server runs on http://localhost:3001
# Test: curl http://localhost:3001/api/hello
```

### 3. Push to GitHub
```bash
git add backend-express/
git commit -m "Add Express backend for Vercel deployment"
git push origin main
```

### 4. Deploy to Vercel
- Visit https://vercel.com/new
- Select your GitHub repository
- Framework: **Node.js**
- Root Directory: **backend-express**

### 5. Set Environment Variables in Vercel
Go to Project Settings → Environment Variables:
```
DATABASE_URL = postgresql://user:password@...
JWT_SECRET = your-super-secret-key
GOOGLE_CLIENT_ID = your-google-client-id
NODE_ENV = production
```

### 6. Deploy
Click "Deploy" and wait ~2 minutes

---

## Migration from Laravel to Express

### Database Schema
| Laravel | Express |
|---------|---------|
| Users table | Same structure via Prisma |
| Sanctum tokens | JWT tokens |
| Hash::make() | bcryptjs.hash() |
| Validator facade | Custom validation |

### Authentication
| Feature | Laravel | Express |
|---------|---------|---------|
| Token Gen | createToken() | jwt.sign() |
| Token Verify | auth:sanctum middleware | verifyToken() middleware |
| Token Format | Sanctum format | JWT (Bearer token) |
| Expiry | No default | 7 days |

### API Response Format
**Same for both** ✅
```json
{
  "status": true,
  "message": "...",
  "user": {...},
  "token": "...",
  "access_token": "..."
}
```

---

## Environment Setup

### Neon Database URL
From Neon dashboard:
```
DATABASE_URL="postgresql://user:password@ep-host.neon.tech/batik_batam?sslmode=require"
```

### JWT Secret
Generate a strong random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 Client ID for Web
3. Add Vercel URL to Authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/google/callback`
4. Copy Client ID to `GOOGLE_CLIENT_ID`

---

## Testing

### Health Check
```bash
curl https://your-app.vercel.app/api/hello
```

### Register
```bash
curl -X POST https://your-app.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User (Protected)
```bash
curl https://your-app.vercel.app/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Vercel Configuration

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

### Build Command
- Build: `npm run build` (no build needed)
- Output Directory: Leave empty

---

## Monitoring

### Logs
View real-time logs in Vercel:
- Project → Deployments → Select deployment → Logs

### Database Connections
Neon provides connection pool monitoring:
- Go to Neon console
- Select project → Monitoring
- Check connection status

---

## Troubleshooting

### 502 Bad Gateway
- Check database URL in Environment Variables
- Verify JWT_SECRET is set
- Check Vercel function logs

### Token Not Expiring Correctly
- Verify JWT_SECRET matches between all instances
- Check server time synchronization

### CORS Errors
- CORS is enabled for all origins by default
- Modify in `src/index.js` if needed

### Database Connection Pooling
Neon connection pooling settings (if using connection pool):
```
DATABASE_URL="postgresql://user:password@ep-host-pooler.neon.tech/batik_batam?sslmode=require"
```

---

## Switching Frontend to Express Backend

Update `frontend/lib/axios.js`:
```javascript
// From:
const API_BASE_URL = 'https://your-render-backend.com/api';

// To:
const API_BASE_URL = 'https://your-vercel-backend.vercel.app/api';
```

All endpoints remain the same ✅

---

## Next Steps

1. ✅ Deploy Express backend to Vercel
2. ✅ Update frontend API URL
3. ✅ Test register/login flow
4. ✅ Migrate database (one-time)
5. ✅ Monitor for errors
6. ✅ Optionally add custom domain

---

## Support

For issues:
1. Check Vercel logs: Project → Deployments
2. Check database status: Neon console
3. Verify environment variables are set
4. Test health endpoint: `/api/hello`
