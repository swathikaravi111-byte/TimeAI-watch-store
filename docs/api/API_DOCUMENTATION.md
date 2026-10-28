# TimeAI Watch Store - API Documentation

## API Overview

**Base URL**: `http://localhost:3000/api`  
**API Version**: 1.0.0  
**Authentication**: JWT Bearer Token  

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Product Endpoints](#product-endpoints)
3. [Order Endpoints](#order-endpoints)
4. [Wishlist Endpoints](#wishlist-endpoints)
5. [Review Endpoints](#review-endpoints)
6. [Error Handling](#error-handling)
7. [Response Format](#response-format)

---

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, uppercase, lowercase, number, special char)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Error (400)**:
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": null
}
```

---

### 2. Login User

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user with email and password

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### 3. Refresh Token

**Endpoint**: `POST /auth/refresh`

**Description**: Get new access token using refresh token

**Request Body**:
```json
{
  "refreshToken": "string (required)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGc..."
  }
}
```

---

### 4. Get Current User

**Endpoint**: `GET /auth/me`

**Description**: Get authenticated user profile

**Authentication**: Required (Bearer Token)

**Response (200)**:
```json
{
  "success": true,
  "message": "User retrieved",
  "data": { /* user object */ }
}
```

---

### 5. Update Profile

**Endpoint**: `PUT /auth/profile`

**Description**: Update user profile information

**Authentication**: Required

**Request Body**:
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional, valid phone)",
  "avatar": "string (optional, URL)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated",
  "data": { /* updated user object */ }
}
```

---

### 6. Change Password

**Endpoint**: `POST /auth/change-password`

**Description**: Change user password

**Authentication**: Required

**Request Body**:
```json
{
  "oldPassword": "string (required)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 7. Logout

**Endpoint**: `POST /auth/logout`

**Description**: Logout user

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### 1. Get All Products

**Endpoint**: `GET /products`

**Description**: Get all products with filtering, sorting, and pagination

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)
- `search` (string)
- `brand` (string)
- `category` (string)
- `minPrice` (number)
- `maxPrice` (number)
- `inStock` (boolean)
- `rating` (number, 1-5)
- `sort` (enum: `newest`, `price-asc`, `price-desc`, `rating`)

**Example**: `GET /products?page=1&limit=20&brand=Rolex&sort=price-asc`

**Response (200)**:
```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [
    {
      "id": "prod-1",
      "name": "Rolex Submariner",
      "price": 12000,
      "brand": "Rolex",
      "rating": 4.8,
      "stock": 5
      /* ... more fields */
    }
  ],
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

### 2. Get Single Product

**Endpoint**: `GET /products/:id`

**Description**: Get detailed product information

**Response (200)**:
```json
{
  "success": true,
  "message": "Product retrieved",
  "data": { /* complete product object */ }
}
```

**Error (404)**:
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 3. Create Product

**Endpoint**: `POST /products`

**Description**: Create new product (Admin only)

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "price": "number (required, > 0)",
  "originalPrice": "number (optional)",
  "brand": "string (required)",
  "model": "string (required)",
  "material": "string (required)",
  "waterResistance": "string (required)",
  "movement": "enum (required): Mechanical, Automatic, Quartz, Digital",
  "images": "array of strings (required)",
  "thumbnail": "string (required)",
  "stock": "integer (required, >= 0)",
  "categoryId": "string (required)",
  "tags": "array of strings (optional)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Product created",
  "data": { /* created product */ }
}
```

---

### 4. Update Product

**Endpoint**: `PUT /products/:id`

**Description**: Update product (Admin only)

**Authentication**: Required (Admin)

**Request Body**: Same as create, all fields optional

**Response (200)**:
```json
{
  "success": true,
  "message": "Product updated",
  "data": { /* updated product */ }
}
```

---

### 5. Delete Product

**Endpoint**: `DELETE /products/:id`

**Description**: Delete product (Admin only)

**Authentication**: Required (Admin)

**Response (200)**:
```json
{
  "success": true,
  "message": "Product deleted"
}
```

---

### 6. Search Products

**Endpoint**: `GET /products/search/:query`

**Description**: Search products by name or brand

**Query Parameters**:
- `limit` (integer, default: 10, max: 100)

**Response (200)**:
```json
{
  "success": true,
  "message": "Search results",
  "data": [ /* products array */ ]
}
```

---

### 7. Get Featured Products

**Endpoint**: `GET /products/featured`

**Description**: Get featured/bestselling products

**Query Parameters**:
- `limit` (integer, default: 8)

**Response (200)**:
```json
{
  "success": true,
  "message": "Featured products",
  "data": [ /* products array */ ]
}
```

---

### 8. Get Recommended Products

**Endpoint**: `GET /products/recommended`

**Description**: Get AI-recommended products

**Query Parameters**:
- `limit` (integer, default: 8)

**Response (200)**:
```json
{
  "success": true,
  "message": "Recommended products",
  "data": [ /* products array */ ]
}
```

---

### 9. Get Products by Category

**Endpoint**: `GET /products/category/:categoryId`

**Description**: Get products in specific category

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response (200)**:
```json
{
  "success": true,
  "message": "Category products",
  "data": [ /* products array */ ],
  "metadata": { /* pagination */ }
}
```

---

## Order Endpoints

### 1. Create Order

**Endpoint**: `POST /orders`

**Description**: Create new order

**Authentication**: Required

**Request Body**:
```json
{
  "items": [
    {
      "productId": "string (required)",
      "quantity": "integer (required, >= 1)"
    }
  ],
  "shippingAddress": {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "street": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "country": "string (required)",
    "zipCode": "string (required)"
  },
  "billingAddress": { /* optional, same structure */ },
  "paymentMethod": "string (required, enum: card, paypal)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Order created",
  "data": {
    "id": "order-1",
    "items": [ /* order items */ ],
    "subtotal": 12000,
    "tax": 1200,
    "shipping": 15,
    "total": 13215,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Get User Orders

**Endpoint**: `GET /orders`

**Description**: Get authenticated user's orders

**Authentication**: Required

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response (200)**:
```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": [ /* orders array */ ],
  "metadata": { /* pagination */ }
}
```

---

### 3. Get Order Details

**Endpoint**: `GET /orders/:id`

**Description**: Get specific order details

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Order retrieved",
  "data": { /* complete order object */ }
}
```

---

### 4. Cancel Order

**Endpoint**: `POST /orders/:id/cancel`

**Description**: Cancel order

**Authentication**: Required

**Request Body**:
```json
{
  "reason": "string (required)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Order cancelled",
  "data": { /* updated order */ }
}
```

---

### 5. Update Order Status (Admin)

**Endpoint**: `PATCH /orders/:id/status`

**Description**: Update order status (Admin only)

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "status": "enum (required): pending, confirmed, shipped, delivered, cancelled"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Order status updated",
  "data": { /* updated order */ }
}
```

---

### 6. Get All Orders (Admin)

**Endpoint**: `GET /orders/admin/all`

**Description**: Get all orders (Admin only)

**Authentication**: Required (Admin)

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response (200)**:
```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": [ /* all orders */ ]
}
```

---

### 7. Get Order Statistics (Admin)

**Endpoint**: `GET /orders/admin/stats`

**Description**: Get order statistics (Admin only)

**Authentication**: Required (Admin)

**Response (200)**:
```json
{
  "success": true,
  "message": "Order statistics",
  "data": {
    "totalOrders": 100,
    "totalRevenue": 1500000,
    "avgOrderValue": 15000,
    "byStatus": {
      "pending": 10,
      "confirmed": 20,
      "shipped": 30,
      "delivered": 35,
      "cancelled": 5
    }
  }
}
```

---

## Wishlist Endpoints

### 1. Add to Wishlist

**Endpoint**: `POST /wishlist`

**Description**: Add product to wishlist

**Authentication**: Required

**Request Body**:
```json
{
  "productId": "string (required)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Added to wishlist"
}
```

---

### 2. Get Wishlist

**Endpoint**: `GET /wishlist`

**Description**: Get user's wishlist

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Wishlist retrieved",
  "data": ["prod-1", "prod-2", "prod-3"]
}
```

---

### 3. Remove from Wishlist

**Endpoint**: `DELETE /wishlist/:productId`

**Description**: Remove product from wishlist

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

---

### 4. Clear Wishlist

**Endpoint**: `DELETE /wishlist`

**Description**: Clear entire wishlist

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Wishlist cleared"
}
```

---

### 5. Check if in Wishlist

**Endpoint**: `GET /wishlist/:productId/check`

**Description**: Check if product is in wishlist

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Check complete",
  "data": {
    "inWishlist": true
  }
}
```

---

## Review Endpoints

### 1. Create Review

**Endpoint**: `POST /products/:productId/reviews`

**Description**: Create product review

**Authentication**: Required

**Request Body**:
```json
{
  "rating": "integer (required, 1-5)",
  "title": "string (required)",
  "comment": "string (required)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Review created",
  "data": {
    "id": "review-1",
    "userId": "user-1",
    "productId": "prod-1",
    "rating": 5,
    "title": "Excellent watch!",
    "comment": "Very satisfied with this purchase",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Get Product Reviews

**Endpoint**: `GET /products/:productId/reviews`

**Description**: Get all reviews for product

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 10)

**Response (200)**:
```json
{
  "success": true,
  "message": "Reviews retrieved",
  "data": [ /* reviews array */ ],
  "metadata": {
    "averageRating": 4.5,
    "pagination": { /* pagination */ }
  }
}
```

---

### 3. Update Review

**Endpoint**: `PUT /reviews/:reviewId`

**Description**: Update user's review

**Authentication**: Required

**Request Body**:
```json
{
  "rating": "integer (optional, 1-5)",
  "title": "string (optional)",
  "comment": "string (optional)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Review updated",
  "data": { /* updated review */ }
}
```

---

### 4. Delete Review

**Endpoint**: `DELETE /reviews/:reviewId`

**Description**: Delete user's review

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "Review deleted"
}
```

---

### 5. Get User Reviews

**Endpoint**: `GET /reviews/user`

**Description**: Get all reviews by authenticated user

**Authentication**: Required

**Response (200)**:
```json
{
  "success": true,
  "message": "User reviews retrieved",
  "data": [ /* user reviews */ ]
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Common Errors

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Product not found"
}
```

**422 Validation Error**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## Response Format

All responses follow a consistent format:

```json
{
  "success": "boolean",
  "message": "string",
  "data": "object or array or null",
  "metadata": "object or null",
  "timestamp": "ISO 8601 datetime"
}
```

---

## Authentication

### Bearer Token

Include JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Structure

```json
{
  "userId": "user-1",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Expiration

- Access Token: 24 hours
- Refresh Token: 7 days

---

## Rate Limiting

- **Window**: 15 minutes
- **Requests**: 100 per window
- **Header**: `X-RateLimit-Remaining`

---

## Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response Metadata**:
```json
{
  "page": 1,
  "limit": 20,
  "total": 250,
  "pages": 13,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "password":"SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"SecurePass123!"
  }'

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get products
curl "http://localhost:3000/api/products?page=1&limit=20&sort=price-asc"
```

---

**API Documentation Generated**: 2024  
**Version**: 1.0.0  
**Status**: Production Ready
