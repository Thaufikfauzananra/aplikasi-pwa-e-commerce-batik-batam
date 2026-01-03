# 📖 API DOCUMENTATION - PWA E-Commerce Batik Batam

## Base URL
```
http://localhost:3000/api (local development)
```

## Authentication
Semua endpoints yang dilindungi memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

Token diperoleh dari login atau register response.

---

## 🔐 AUTH ENDPOINTS

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response (201):
{
  "status": true,
  "message": "Registrasi berhasil!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGci...",
  "access_token": "eyJhbGci..."
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "status": true,
  "message": "Login berhasil!",
  "user": { ... },
  "token": "eyJhbGci...",
  "role": "user"
}
```

### Get Current User
```
GET /me
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Logout
```
POST /logout
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Logout berhasil!"
}
```

### Change Password
```
PUT /change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "oldpass123",
  "new_password": "newpass123",
  "new_password_confirmation": "newpass123"
}

Response (200):
{
  "status": true,
  "message": "Password changed successfully"
}
```

---

## 🛒 PRODUCT ENDPOINTS

### Get All Products
```
GET /products?category=Pakaian%20Wanita&search=batik&page=1&limit=10

Response (200):
{
  "status": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Blus Batik Wanita",
      "slug": "blus-batik-wanita",
      "price": "249000.00",
      "discount": 10,
      "category": "Pakaian Wanita",
      "stock": 50,
      "images": [
        {
          "id": 1,
          "imageUrl": "/images/product1.jpg",
          "isPrimary": true
        }
      ],
      "sizes": [
        { "id": 1, "size": "S", "stock": 10 },
        { "id": 2, "size": "M", "stock": 15 }
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Get Product Detail
```
GET /products/:id

Response (200):
{
  "status": true,
  "message": "Product retrieved successfully",
  "data": { ... }
}
```

### Create Product (Admin)
```
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Blus Batik Baru",
  "description": "Deskripsi produk...",
  "price": 299000,
  "discount": 5,
  "category": "Pakaian Wanita",
  "subcategory": "Kemeja",
  "stock": 50,
  "sku": "BLU-001",
  "weight": 250,
  "images": [
    {
      "url": "/images/new-product.jpg",
      "altText": "Blus Batik"
    }
  ]
}

Response (201):
{
  "status": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

### Update Product (Admin)
```
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 350000,
  "stock": 45
}

Response (200):
{
  "status": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

### Delete Product (Admin)
```
DELETE /products/:id
Authorization: Bearer <admin_token>

Response (200):
{
  "status": true,
  "message": "Product deleted successfully"
}
```

---

## 🛍️ CART ENDPOINTS

### Get Cart
```
GET /cart
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "cartId": 1,
        "productId": 1,
        "productSizeId": 2,
        "quantity": 2,
        "price": "249000.00",
        "product": { ... },
        "size": { "id": 2, "size": "M" }
      }
    ]
  }
}
```

### Add to Cart
```
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "productSizeId": 2,
  "quantity": 2
}

Response (201):
{
  "status": true,
  "message": "Item added to cart successfully",
  "data": { ... }
}
```

### Update Cart Item Quantity
```
PUT /cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}

Response (200):
{
  "status": true,
  "message": "Cart item updated successfully",
  "data": { ... }
}
```

### Remove from Cart
```
DELETE /cart/items/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Item removed from cart successfully"
}
```

### Clear Cart
```
DELETE /cart
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Cart cleared successfully"
}
```

---

## 💔 WISHLIST ENDPOINTS

### Get Wishlist
```
GET /wishlist
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Wishlist retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "productId": 1,
      "product": { ... }
    }
  ]
}
```

### Add to Wishlist
```
POST /wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1
}

Response (201):
{
  "status": true,
  "message": "Product added to wishlist",
  "data": { ... }
}
```

### Remove from Wishlist
```
DELETE /wishlist?productId=1
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Product removed from wishlist"
}
```

---

## 📦 ADDRESS ENDPOINTS

### Get Addresses
```
GET /addresses
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "label": "Rumah",
      "recipientName": "John Doe",
      "phoneNumber": "081234567890",
      "province": "Riau",
      "city": "Batam",
      "district": "Sekupang",
      "postalCode": "29400",
      "streetAddress": "Jl. Sudirman No. 123",
      "isDefault": true
    }
  ]
}
```

### Create Address
```
POST /addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Rumah",
  "recipientName": "John Doe",
  "phoneNumber": "081234567890",
  "province": "Riau",
  "city": "Batam",
  "district": "Sekupang",
  "postalCode": "29400",
  "streetAddress": "Jl. Sudirman No. 123",
  "isDefault": true
}

Response (201):
{
  "status": true,
  "message": "Address created successfully",
  "data": { ... }
}
```

### Update Address
```
PUT /addresses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Kantor",
  "recipientName": "Jane Doe"
}

Response (200):
{
  "status": true,
  "message": "Address updated successfully",
  "data": { ... }
}
```

### Delete Address
```
DELETE /addresses/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Address deleted successfully"
}
```

---

## 📋 ORDER ENDPOINTS

### Get Orders
```
GET /orders
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20240101-001",
      "userId": 1,
      "addressId": 1,
      "status": "pending",
      "paymentStatus": "unpaid",
      "subtotal": "498000.00",
      "discount": "0.00",
      "tax": "0.00",
      "shippingCost": "25000.00",
      "total": "523000.00",
      "items": [ ... ],
      "address": { ... },
      "payment": null
    }
  ]
}
```

### Get Order Detail
```
GET /orders/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Order retrieved successfully",
  "data": { ... }
}
```

### Create Order
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": 1,
  "items": [
    {
      "productId": 1,
      "productSizeId": 2,
      "productName": "Blus Batik",
      "quantity": 2,
      "price": 249000,
      "subtotal": 498000
    }
  ],
  "subtotal": 498000,
  "discount": 0,
  "tax": 0,
  "shippingCost": 25000,
  "total": 523000,
  "notes": "Pesanan khusus"
}

Response (201):
{
  "status": true,
  "message": "Order created successfully",
  "data": { ... }
}
```

---

## 💳 PAYMENT ENDPOINTS

### Create Payment
```
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "amount": 523000
}

Response (201):
{
  "status": true,
  "message": "Payment transaction created",
  "data": {
    "payment": { ... },
    "snapToken": "mock-snap-token-...",
    "snapUrl": "https://app.midtrans.com/snap/v1/transactions/..."
  }
}
```

### Get Payment Status
```
GET /payments/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Payment retrieved successfully",
  "data": {
    "id": 1,
    "transactionId": "TXN-...",
    "orderId": 1,
    "amount": "523000.00",
    "status": "pending",
    "paidAt": null,
    "history": [ ... ]
  }
}
```

### Confirm Payment (Testing)
```
POST /payments/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Payment confirmed successfully",
  "data": {
    "id": 1,
    "status": "paid",
    "paidAt": "2024-01-04T10:30:00.000Z"
  }
}
```

---

## 🔔 NOTIFICATION ENDPOINTS

### Get Notifications
```
GET /notifications
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "order",
      "title": "Pesanan Dikonfirmasi",
      "message": "Pesanan #ORD-001 telah dikonfirmasi",
      "relatedOrderId": 1,
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-04T10:00:00.000Z"
    }
  ]
}
```

### Create Notification
```
POST /notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "type": "order",
  "title": "Pesanan Dikonfirmasi",
  "message": "Pesanan telah dikonfirmasi",
  "relatedOrderId": 1,
  "actionUrl": "/orders/1"
}

Response (201):
{
  "status": true,
  "message": "Notification created successfully",
  "data": { ... }
}
```

### Mark as Read
```
PUT /notifications/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Notification marked as read",
  "data": { ... }
}
```

### Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <token>

Response (200):
{
  "status": true,
  "message": "Notification deleted successfully"
}
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "status": false,
  "message": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "status": false,
  "message": "Unauthorized - Admin access required"
}
```

### Not Found (404)
```json
{
  "status": false,
  "message": "Resource not found"
}
```

### Validation Error (422)
```json
{
  "status": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

### Server Error (500)
```json
{
  "status": false,
  "message": "Internal Server Error"
}
```

---

## Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
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
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Add to Cart (dengan token)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": 1,
    "productSizeId": 2,
    "quantity": 2
  }'
```

---

**Last Updated**: 4 January 2026
