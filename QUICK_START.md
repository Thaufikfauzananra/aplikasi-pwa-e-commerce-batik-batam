# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js v18+
- npm atau yarn
- PostgreSQL database (atau Neon PostgreSQL)
- Git

---

## 1️⃣ SETUP DATABASE

### Option A: Local PostgreSQL
```bash
# 1. Create database
createdb batik_batam

# 2. Setup .env
cd website
cp .env.example .env

# Edit .env dengan database URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/batik_batam"
# JWT_SECRET="your-secret-key-here"
```

### Option B: Neon PostgreSQL (Cloud)
```bash
# 1. Sign up at https://neon.tech
# 2. Create project & database
# 3. Copy connection string to .env
DATABASE_URL="postgresql://user:password@host:5432/db_name"
```

---

## 2️⃣ INSTALL DEPENDENCIES

```bash
cd website
npm install
```

---

## 3️⃣ RUN DATABASE MIGRATIONS

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run migrate
```

Ini akan create semua tables yang diperlukan di database.

---

## 4️⃣ (OPTIONAL) SEED DATABASE DENGAN DUMMY DATA

Buat file `prisma/seed.js`:

```javascript
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcryptjs.hash('admin123', 10),
      role: 'admin',
    },
  });

  // Create regular user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'user@example.com',
      password: await bcryptjs.hash('user123', 10),
      role: 'user',
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Blus Batik Wanita',
      slug: 'blus-batik-wanita',
      description: 'Blus batik berkualitas tinggi dengan design eksklusif',
      price: 249000,
      discount: 10,
      category: 'Pakaian Wanita',
      subcategory: 'Kemeja',
      stock: 50,
      sku: 'BLU-001',
      weight: 250,
      images: {
        create: [
          {
            imageUrl: '/images/blus-1.jpg',
            isPrimary: true,
          },
        ],
      },
      sizes: {
        create: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 10 },
        ],
      },
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Jalankan:
```bash
npm run seed
```

---

## 5️⃣ START DEVELOPMENT SERVER

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 6️⃣ TEST API ENDPOINTS

### A. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### B. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Note**: Copy the `token` dari response untuk digunakan di request berikutnya

### C. Get Products
```bash
curl http://localhost:3000/api/products
```

### D. Add to Cart (dengan token)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": 1,
    "productSizeId": 2,
    "quantity": 2
  }'
```

### E. Get Cart
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 7️⃣ AKSES APLIKASI

### Frontend
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Beranda**: http://localhost:3000/Beranda
- **Admin**: http://localhost:3000/admin/dashboard

### Prisma Studio (Database GUI)
```bash
npm run db:studio
```
Akan buka di `http://localhost:5555`

---

## ⚙️ ENVIRONMENT VARIABLES

Edit `website/.env`:

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/batik_batam

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Midtrans (TODO)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_ENVIRONMENT=sandbox

# Server
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth (TODO)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🐛 TROUBLESHOOTING

### "Port 3000 already in use"
```bash
# Gunakan port berbeda
PORT=3001 npm run dev
```

### "Database connection error"
```bash
# Check DATABASE_URL di .env
# Verify database exists
# Ensure PostgreSQL running
```

### "Prisma migration error"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually
npm run migrate
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 PROJECT STRUCTURE

```
website/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication
│   │   ├── products/       # Products CRUD
│   │   ├── cart/           # Shopping cart
│   │   ├── orders/         # Orders
│   │   ├── addresses/      # Delivery addresses
│   │   ├── wishlist/       # Wishlist
│   │   ├── notifications/  # Notifications
│   │   └── payments/       # Payments
│   ├── admin/              # Admin pages
│   ├── (pages)/            # User pages
│   └── (components)/       # UI components
├── lib/
│   ├── axios.js            # API client
│   ├── db.js               # Database connection
│   └── image.js            # Image utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration files
│   └── seed.js             # Seed data
└── public/                 # Static files
```

---

## 🔐 LOGIN CREDENTIALS (SETELAH SEED)

**Admin Account**:
```
Email: admin@example.com
Password: admin123
```

**User Account**:
```
Email: user@example.com
Password: user123
```

---

## 📝 NEXT STEPS

1. ✅ Database setup & migrations
2. ✅ Test API endpoints
3. ⏳ Frontend integration (replace localStorage dengan API)
4. ⏳ Midtrans payment integration
5. ⏳ Admin features
6. ⏳ PWA features
7. ⏳ Deployment

---

## 📚 DOKUMENTASI LEBIH LANJUT

- [API Documentation](./API_DOCUMENTATION.md)
- [Features Status](./FEATURES_STATUS.md)
- [Implementation Progress](./IMPLEMENTATION_PROGRESS.md)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)

---

**Last Updated**: 4 January 2026
