# SmartBite — Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 7+ | https://www.mongodb.com/try/download |
| Docker | 24+ | https://docker.com/get-started |
| Git | 2+ | https://git-scm.com |

## Method 1: Docker (Recommended — Easiest)

### Step 1: Navigate to project directory
```bash
cd smartbite
```

### Step 2: Start all services with Docker Compose
```bash
docker-compose up --build
```

This single command will:
- Pull the MongoDB image
- Build all 6 backend service images
- Build the frontend image
- Start all containers on a shared network
- Map all ports automatically

### Step 3: Seed demo data
```bash
# In a new terminal
docker exec smartbite-restaurant node src/seed.js
```

### Step 4: Access the application
- Frontend: http://localhost:3000
- API Gateway: http://localhost:4000
- Health Check: http://localhost:4000/health

### Stopping Docker
```bash
docker-compose down              # Stop containers
docker-compose down -v           # Stop and remove volumes (reset data)
```

---

## Method 2: Manual Setup (Without Docker)

### Step 1: Start MongoDB
```bash
# Windows
mongod

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 2: Install dependencies for ALL services

Open separate terminal windows for each:

```bash
# Terminal 1: User Service
cd services/user-service
npm install
npm start

# Terminal 2: Restaurant Service
cd services/restaurant-service
npm install
npm start

# Terminal 3: Order Service
cd services/order-service
npm install
npm start

# Terminal 4: Payment Service
cd services/payment-service
npm install
npm start

# Terminal 5: Delivery Service
cd services/delivery-service
npm install
npm start

# Terminal 6: API Gateway (start AFTER other services)
cd services/api-gateway
npm install
npm start

# Terminal 7: Frontend
cd frontend
npm install
npm run dev
```

### Step 3: Seed demo data
```bash
cd services/restaurant-service
npm run seed
```

### Step 4: Verify all services are running
Visit each health endpoint:
- http://localhost:4000/health (Gateway)
- http://localhost:4001/health (User)
- http://localhost:4002/health (Restaurant)
- http://localhost:4003/health (Order)
- http://localhost:4004/health (Payment)
- http://localhost:4005/health (Delivery)

---

## Quick Test Flow

1. Open http://localhost:3000
2. Click **Sign Up** → Create an account
3. Browse restaurants on the home page
4. Click a restaurant → Add items to cart
5. Go to **Cart** → Enter address → **Place Order**
6. You'll be redirected to the **Track Order** page
7. Watch real-time delivery updates via WebSocket!

## Load Testing

```bash
pip install locust
cd testing
locust -f locustfile.py --host=http://localhost:4000
# Open http://localhost:8089 in browser
```
