# 🍔 SmartBite — AI-Powered Distributed Food Delivery Platform

> A microservices-based distributed computing project for university final-year evaluation

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Frontend](https://img.shields.io/badge/Frontend-React.js-cyan)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![WebSocket](https://img.shields.io/badge/Realtime-Socket.IO-red)

## 📋 Overview

SmartBite is a distributed food delivery platform built using **Microservices Architecture**. It demonstrates core distributed computing concepts including service decomposition, inter-service communication, data isolation, real-time communication, containerization, and fault tolerance.

## 🏗️ Architecture

The system consists of **6 independent microservices**:

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **API Gateway** | 4000 | — | Central routing, JWT auth |
| **User Service** | 4001 | smartbite_users | Auth & profiles |
| **Restaurant Service** | 4002 | smartbite_restaurants | Restaurants & menus |
| **Order Service** | 4003 | smartbite_orders | Order management |
| **Payment Service** | 4004 | smartbite_payments | Mock payments |
| **Delivery Service** | 4005 | smartbite_delivery | Real-time tracking |
| **Frontend** | 3000 | — | React.js UI |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

### Option 1: Run with Docker (Recommended)
```bash
docker-compose up --build
```

### Option 2: Run Locally
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2-7: Start each service
cd services/user-service && npm install && npm start
cd services/restaurant-service && npm install && npm start
cd services/order-service && npm install && npm start
cd services/payment-service && npm install && npm start
cd services/delivery-service && npm install && npm start
cd services/api-gateway && npm install && npm start

# Terminal 8: Seed restaurant data
cd services/restaurant-service && npm run seed

# Terminal 9: Start frontend
cd frontend && npm install && npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 🔑 Key Features

- ✅ User registration & JWT authentication
- ✅ Restaurant & menu browsing
- ✅ Shopping cart with multi-item support
- ✅ Order placement with inter-service communication
- ✅ Simulated payment processing
- ✅ Real-time delivery tracking (WebSocket/Socket.IO)
- ✅ Docker containerization
- ✅ Load testing with Locust

## 📡 API Endpoints

| Method | Endpoint | Service | Auth |
|--------|----------|---------|------|
| POST | /api/users/register | User | No |
| POST | /api/users/login | User | No |
| GET | /api/users/profile | User | Yes |
| GET | /api/restaurants | Restaurant | No |
| GET | /api/restaurants/menu/:id | Restaurant | No |
| POST | /api/orders/create | Order | Yes |
| GET | /api/orders/user/:userId | Order | Yes |
| POST | /api/payments/pay | Payment | Yes |
| POST | /api/delivery/assign | Delivery | Yes |
| GET | /api/delivery/:orderId | Delivery | Yes |

## 🧪 Testing

### Postman
Import the collection from `testing/postman/` directory.

### Load Testing (Locust)
```bash
pip install locust
cd testing
locust -f locustfile.py --host=http://localhost:4000
# Open http://localhost:8089
```

## 🐳 Docker

Each service has its own Dockerfile. The `docker-compose.yml` orchestrates all containers:

```bash
docker-compose up --build    # Build and start
docker-compose down          # Stop all
docker-compose ps            # Check status
```

## 👥 Team
- Computer Systems Engineering, Final Year Project
- Distributed Computing Course

## 📄 License
Academic use only.
