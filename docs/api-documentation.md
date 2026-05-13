# SmartBite — API Documentation

## Base URL
All requests go through the API Gateway: `http://localhost:4000`

## Authentication
Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. User Service (`/api/users`)

### POST `/api/users/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "Ali Khan",
  "email": "ali@example.com",
  "password": "secret123",
  "phone": "0300-1234567",
  "address": "123 University Road, Karachi"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { 
      "_id": "...", 
      "name": "Ali Khan", 
      "email": "ali@example.com", 
      "role": "customer",
      "loyaltyPoints": 150
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST `/api/users/login`
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "ali@example.com",
  "password": "secret123"
}
```

### GET `/api/users/profile` 🔒
Get authenticated user's profile. Requires JWT token.

### PUT `/api/users/profile` 🔒
Update user details (name, phone, address).
**Request Body:** `{ "name": "...", "phone": "...", "address": "..." }`

### DELETE `/api/users/profile` 🔒
Permanently delete the user's account.

---

## 2. Restaurant Service (`/api/restaurants`)

### GET `/api/restaurants`
List all open restaurants.

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    { "_id": "...", "name": "Karachi Biryani House", "cuisine": "Pakistani", "rating": 4.5, "deliveryTime": "30-40 min" }
  ]
}
```

### GET `/api/restaurants/menu/:restaurantId`
Get menu items for a specific restaurant.

### POST `/api/restaurants/add`
Add a new restaurant.

### POST `/api/restaurants/menu/add`
Add a menu item to a restaurant.

---

## 3. Order Service (`/api/orders`) 🔒

### POST `/api/orders/create`
Create order, process payment, assign delivery.

**Request Body:**
```json
{
  "restaurantId": "restaurant_object_id",
  "restaurantName": "Karachi Biryani House",
  "items": [
    { "name": "Chicken Biryani", "price": 350, "quantity": 2 },
    { "name": "Raita", "price": 80, "quantity": 1 }
  ],
  "totalAmount": 780,
  "deliveryAddress": "456 Main St, Karachi",
  "paymentMethod": "card"
}
```

**Inter-Service Communication:**
1. Saves order → 2. Calls Payment Service → 3. Calls Delivery Service

### GET `/api/orders/user/:userId`
Get all orders for a user (sorted by newest first).

### GET `/api/orders/:orderId`
Get single order details.

### PUT `/api/orders/status`
Update order status. Body: `{ "orderId": "...", "status": "preparing" }`

### PUT `/api/orders/cancel/:orderId`
Cancel an order.

---

## 4. Payment Service (`/api/payments`) 🔒

### POST `/api/payments/pay`
Process a simulated payment. 90% success rate for card, 100% for cash.

**Request Body:**
```json
{
  "orderId": "order_object_id",
  "userId": "user_object_id",
  "amount": 780,
  "method": "card"
}
```

### GET `/api/payments/status/:paymentId`
Check payment status.

### GET `/api/payments/order/:orderId`
Get payment by order ID.

---

## 5. Delivery Service (`/api/delivery`) 🔒

### POST `/api/delivery/assign`
Assign a random rider to an order. Triggers WebSocket simulation.

### GET `/api/delivery/:orderId`
Get delivery status for an order.

### PUT `/api/delivery/status`
Manually update delivery status.

---

---

## 6. Review Service (`/api/reviews`) 🔒
Handles ratings and feedback for restaurants.

### POST `/api/reviews/add`
Submit a review for a delivered order.
**Request Body:** `{ "orderId": "...", "restaurantId": "...", "rating": 5, "comment": "Great!" }`

### GET `/api/reviews/restaurant/:restaurantId`
Get all reviews for a restaurant.

---

## 7. Analytics Service (`/api/analytics`) 🔒 (Admin Only)
Aggregates data from all services for business intelligence.

### GET `/api/analytics/dashboard`
Returns consolidated KPIs: total revenue, order count, trends, and payment breakdown.

---

## 8. WebSocket Events (Socket.IO)

Connect to: `http://localhost:4005`

### 8.1 Tracking Events (Port 4005)
| Event | Data | Description |
|-------|------|-------------|
| `track_order` | `{ orderId }` | Start tracking an order |
| `start_simulation` | `{ orderId }` | Manually start delivery simulation |

### 8.2 Chat Events (Port 4008)
| Event | Data | Description |
|-------|------|-------------|
| `join_chat` | `orderId` | Join chat room for an order |
| `send_message` | `{ orderId, text, sender }` | Send a message (customer/rider) |
| `receive_message`| `{ text, sender, timestamp }` | Broadcasted message (includes auto-replies) |

### Server → Client Events
| Event | Data | Description |
|-------|------|-------------|
| `delivery_status` | `{ orderId, status, rider, estimatedTime }` | Current delivery status |
| `delivery_update` | `{ orderId, status, message, estimatedTime }` | Status change notification |
| `location_update` | `{ orderId, location, estimatedTime }` | Rider GPS update |
