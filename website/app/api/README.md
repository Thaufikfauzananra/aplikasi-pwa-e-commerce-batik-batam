# API Routes Fix - Error 405

## Perbaikan yang dilakukan:

1. **Menambahkan OPTIONS handler** untuk CORS preflight di semua route
2. **Menambahkan CORS headers** di semua response
3. **Memastikan method diekspor dengan benar** (GET, POST, OPTIONS)

## Route yang diperbaiki:

- `/api/auth/register` - POST & OPTIONS
- `/api/auth/login` - POST & OPTIONS  
- `/api/health` - GET & OPTIONS

## Testing:

Setelah restart Next.js dev server, test dengan:

```bash
# Test health endpoint
curl -X GET http://localhost:3000/api/health

# Test register endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","password_confirmation":"123456"}'

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Catatan:

- Pastikan Next.js dev server sudah restart setelah perubahan
- Pastikan file `lib/db.js` ada dan DATABASE_URL sudah dikonfigurasi
- Error 405 biasanya terjadi karena method tidak didukung atau route handler tidak ditemukan

