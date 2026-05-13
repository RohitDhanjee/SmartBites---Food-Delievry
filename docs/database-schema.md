# SmartBite — Database Schema Documentation

## Database Strategy

SmartBite uses **database-per-service** pattern with MongoDB. Each microservice has its own dedicated database to ensure data isolation and loose coupling.

| Service | Database Name | Collections |
|---------|--------------|-------------|
| User Service | `smartbite_users` | users |
| Restaurant Service | `smartbite_restaurants` | restaurants, menuitems |
| Order Service | `smartbite_orders` | orders |
| Payment Service | `smartbite_payments` | payments |
| Delivery Service | `smartbite_delivery` | deliveries |

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    RESTAURANT ||--o{ MENUITEM : has
    RESTAURANT ||--o{ ORDER : receives
    ORDER ||--|| PAYMENT : has
    ORDER ||--|| DELIVERY : has

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string phone
        string address
        string role
        Date createdAt
    }

    RESTAURANT {
        ObjectId _id PK
        string name
        string cuisine
        string address
        number rating
        string image
        string deliveryTime
        boolean isOpen
    }

    MENUITEM {
        ObjectId _id PK
        ObjectId restaurantId FK
        string name
        string description
        number price
        string category
        string image
        boolean isAvailable
    }

    ORDER {
        ObjectId _id PK
        string userId FK
        string restaurantId FK
        string restaurantName
        array items
        number totalAmount
        string status
        string paymentId FK
        string deliveryId FK
        string deliveryAddress
    }

    PAYMENT {
        ObjectId _id PK
        string orderId FK
        string userId FK
        number amount
        string method
        string status
        string transactionId UK
    }

    DELIVERY {
        ObjectId _id PK
        string orderId FK
        string riderId
        string riderName
        string riderPhone
        string status
        number estimatedTime
        object location
    }
```

## Sample Documents

### User
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ali Khan",
  "email": "ali@example.com",
  "password": "$2a$10$Xk7QJ...(bcrypt hash)",
  "phone": "0300-1234567",
  "address": "123 University Road, Karachi",
  "role": "customer",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Restaurant
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "name": "Karachi Biryani House",
  "cuisine": "Pakistani",
  "address": "123 University Road, Karachi",
  "rating": 4.5,
  "image": "https://images.unsplash.com/...",
  "deliveryTime": "30-40 min",
  "isOpen": true
}
```

### Order
```json
{
  "_id": "507f1f77bcf86cd799439033",
  "userId": "507f1f77bcf86cd799439011",
  "restaurantId": "507f1f77bcf86cd799439022",
  "restaurantName": "Karachi Biryani House",
  "items": [
    { "name": "Chicken Biryani", "price": 350, "quantity": 2 },
    { "name": "Raita", "price": 80, "quantity": 1 }
  ],
  "totalAmount": 780,
  "status": "confirmed",
  "paymentId": "507f1f77bcf86cd799439044",
  "deliveryId": "507f1f77bcf86cd799439055",
  "deliveryAddress": "456 Main Street, Karachi"
}
```
