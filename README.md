# 🍔 SmartBite — AI-Powered Distributed Food Delivery Platform

> A production-grade microservices-based distributed computing ecosystem for university final-year evaluation.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Frontend](https://img.shields.io/badge/Frontend-React.js-cyan)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![WebSocket](https://img.shields.io/badge/Realtime-Socket.IO-red)
![Testing](https://img.shields.io/badge/Testing-Locust-orange)

## 📋 Overview

SmartBite is a distributed food delivery platform built using **Microservices Architecture**. It demonstrates core distributed computing concepts including service decomposition, inter-service communication (REST & WebSockets), data isolation (Database-per-service), containerization, security (JWT & Rate Limiting), and fault tolerance.

## 🏗️ Architecture

The system consists of **9 independent microservices** orchestrated via Docker Compose:

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **API Gateway** | 4000 | — | Central entry point, JWT auth, Rate Limiting |
| **User Service** | 4001 | smartbite_users | Identity management & Bcrypt auth |
| **Restaurant Service** | 4002 | smartbite_restaurants | Menu & catalog management |
| **Order Service** | 4003 | smartbite_orders | Transactional order lifecycle |
| **Payment Service** | 4004 | smartbite_payments | Payment simulation & logging |
| **Delivery Service** | 4005 | smartbite_delivery | Real-time rider tracking (Socket.IO) |
| **Review Service** | 4006 | smartbite_reviews | User feedback & rating engine |
| **Analytics Service** | 4007 | smartbite_analytics | Business Intelligence & Trends |
| **Chat Service** | 4008 | smartbite_chat | Support chat with AI Auto-Replies |
| **Frontend** | 5173 | — | React.js + Tailwind CSS UI |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose

### Option 1: Run with Docker (Recommended)
```bash
docker-compose up --build
```

### Option 2: Run Locally
1. Start MongoDB.
2. Navigate to each directory in `services/` and run `npm install && npm start`.
3. Seed restaurant data: `cd services/restaurant-service && npm run seed`.
4. Start frontend: `cd frontend && npm run dev`.

## 🔑 Key Features

- ✅ **Distributed Auth**: Stateless JWT-based authentication across all services.
- ✅ **Real-time Tracking**: Low-latency coordinate updates via WebSockets (Socket.IO).
- ✅ **AI Support**: Chat service integrated with AI-powered auto-responses for support.
- ✅ **Business BI**: Analytics dashboard for monitoring platform performance.
- ✅ **Data Isolation**: Strict database-per-service pattern using MongoDB.
- ✅ **Fault Tolerance**: Isolated service failure handling via API Gateway.
- ✅ **Security**: Zero-trust gateway with HTTP 429 Rate Limiting protection.

## 📡 Key API Endpoints

| Method | Endpoint | Service | Description |
|--------|----------|---------|-------------|
| POST | `/api/users/login` | User | Authentication & Token issuance |
| GET | `/api/restaurants` | Restaurant | List all restaurants |
| POST | `/api/orders/create` | Order | Place a new order |
| POST | `/api/reviews/create` | Review | Submit user feedback |
| GET | `/api/analytics/stats` | Analytics | Platform-wide BI stats |
| POST | `/api/chat/message` | Chat | Real-time support message |

## 🧪 Performance Benchmarks

The system was stress-tested using **Locust** with 100 concurrent users:

- **Total Requests Handled**: 1,367 (in 60 seconds)
- **Peak Throughput**: 24.07 Requests Per Second (RPS)
- **Average Latency**: 192 ms
- **Success Rate**: 85.4% (with 200 instances of successful Rate Limiting/Protection)

## 🐳 Docker Orchestration

The `docker-compose.yml` manages all 9 services and the frontend, ensuring a consistent environment:

```bash
docker-compose up -d     # Run in background
docker-compose logs -f   # Follow logs
docker-compose down      # Clean up
```

## 👥 Team & Academic Info
- **Project**: SmartBite Final Year Project
- **Department**: Computer Systems Engineering
- **Focus**: Distributed Systems, Microservices, Resilient Cloud Architectures

## 📄 License
Academic use only. Copyright © 2024-2025 Rohit Dhanjee & Team.
