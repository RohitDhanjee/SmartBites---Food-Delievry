# SmartBite — Viva Questions & Answers

## Section 1: Architecture & Design (Most Common)

### Q1: Why did you choose microservices architecture over monolithic?
**A:** Monolithic architecture bundles all features into a single codebase. While simpler to start, it has critical limitations for distributed systems:
- **Tight coupling**: A change in one module can break others
- **Single point of failure**: If one part crashes, the entire app goes down
- **Scaling limitations**: Must scale the entire app even if only one feature needs it

Microservices solve these by decomposing the system into independent services, each with its own database, allowing independent deployment, scaling, and fault isolation — which are core requirements for distributed computing.

### Q2: What is an API Gateway and why is it needed?
**A:** The API Gateway is the single entry point for all client requests. It acts as a reverse proxy that:
- Routes requests to the correct microservice
- Handles authentication (JWT verification)
- Provides a unified URL for the frontend (instead of managing 5+ service URLs)
- Enables load balancing and rate limiting

Without it, the frontend would need to know the address of every microservice, creating tight coupling and security risks.

### Q3: How do your services communicate with each other?
**A:** We use two communication patterns:
1. **Synchronous HTTP/REST**: The Order Service calls the Payment Service and Delivery Service via HTTP POST requests when creating an order
2. **WebSocket (Socket.IO)**: The Delivery Service pushes real-time updates to the frontend client

This demonstrates both synchronous and asynchronous communication in distributed systems.

### Q4: How is data isolation maintained?
**A:** Each microservice has its own MongoDB database:
- User Service → `smartbite_users`
- Restaurant Service → `smartbite_restaurants`
- Order Service → `smartbite_orders`
- Payment Service → `smartbite_payments`
- Delivery Service → `smartbite_delivery`

This ensures loose coupling — if one database goes down, other services continue functioning.

### Q5: What is fault tolerance and how is it demonstrated?
**A:** Fault tolerance is the system's ability to continue operating when a component fails. In SmartBite:
- If the Payment Service crashes, orders can still be placed (with pending payment status)
- If the Delivery Service is down, orders are recorded and delivery is assigned when it recovers
- The API Gateway returns a 503 error for unavailable services instead of crashing
- Docker's `restart: unless-stopped` automatically restarts failed containers

---

## Section 2: Technology Stack

### Q6: Why Node.js and Express?
**A:** Node.js uses an event-driven, non-blocking I/O model making it excellent for handling many simultaneous connections (perfect for real-time delivery tracking). Express.js is a minimal framework that doesn't add unnecessary complexity — ideal for microservices that should be lightweight.

### Q7: Why MongoDB over SQL databases?
**A:** MongoDB is a NoSQL document database that offers:
- **Schema flexibility**: Different services have different data structures
- **JSON-native**: Works naturally with Node.js
- **Horizontal scaling**: Built-in sharding support
- **Separate databases easily**: Each service gets its own database without complex schema management

### Q8: How does JWT authentication work?
**A:** JWT (JSON Web Token) is a stateless authentication mechanism:
1. User logs in with email/password
2. Server verifies credentials and generates a signed JWT containing `{userId, email, role}`
3. Client stores the JWT in localStorage
4. Every subsequent request includes the JWT in the `Authorization: Bearer <token>` header
5. The API Gateway verifies the token and forwards user info to downstream services

"Stateless" means the server doesn't store session data — the token itself contains all needed info.

### Q9: How does bcrypt work for password security?
**A:** bcrypt is a password hashing algorithm that:
1. Generates a random salt (10 rounds)
2. Hashes the password with the salt
3. Stores the hash (never the plain password)
4. During login, hashes the entered password and compares it with the stored hash

Even if the database is compromised, passwords cannot be reversed from hashes.

### Q10: What is Socket.IO and how is it different from regular HTTP?
**A:** 
- **HTTP**: Request-response model. Client must ask for updates (polling)
- **WebSocket**: Persistent bidirectional connection. Server can push data to client instantly

Socket.IO is a library that provides WebSocket with automatic fallback to HTTP long-polling. In SmartBite, it enables real-time delivery tracking without the client constantly asking "is my order ready?"

---

## Section 3: Docker & Deployment

### Q11: What is Docker and why use it?
**A:** Docker is a containerization platform that packages applications and their dependencies into lightweight, portable containers. Benefits:
- **Consistency**: "Works on my machine" problem eliminated
- **Isolation**: Each service runs in its own container
- **Portability**: Containers run the same on any OS
- **Resource efficiency**: Containers share the OS kernel (unlike VMs)

### Q12: What is Docker Compose?
**A:** Docker Compose is a tool for defining and running multi-container Docker applications. Our `docker-compose.yml` defines all 8 services (MongoDB, 6 backend services, frontend) and their configuration. A single `docker-compose up` command starts the entire distributed system.

### Q13: What is the difference between a Docker image and a container?
**A:** 
- **Image**: A read-only template/blueprint containing the application code and dependencies
- **Container**: A running instance of an image

Analogy: An image is like a class in OOP, and a container is like an object (instance of that class).

---

## Section 4: Distributed Computing Concepts

### Q14: What are the CAP theorem implications for SmartBite?
**A:** The CAP theorem states a distributed system can guarantee only 2 of 3: Consistency, Availability, Partition Tolerance. SmartBite prioritizes:
- **Availability** (AP system): Services remain available even if some are down
- **Partition Tolerance**: The system handles network failures between services
- **Eventual Consistency**: Order status may take a moment to propagate across services

### Q15: What is horizontal vs vertical scaling?
**A:**
- **Vertical scaling**: Adding more resources (CPU/RAM) to a single server — has physical limits
- **Horizontal scaling**: Adding more instances of a service — theoretically unlimited

SmartBite supports horizontal scaling because each microservice is stateless and can have multiple instances behind a load balancer.

### Q16: What is the difference between synchronous and asynchronous communication?
**A:**
- **Synchronous**: Caller waits for response (Order → Payment HTTP call). Simple but creates dependency
- **Asynchronous**: Caller doesn't wait (WebSocket push, message queues). More resilient but complex

SmartBite uses both: synchronous REST for order creation flow, asynchronous WebSocket for delivery tracking.

### Q17: What is service discovery?
**A:** Service discovery is how services find each other's network locations. In SmartBite, we use:
- **Static configuration**: Service URLs stored in environment variables
- **Docker DNS**: Docker Compose creates a network where services find each other by container name (e.g., `http://user-service:4001`)

In production, tools like Consul, Eureka, or Kubernetes DNS provide dynamic service discovery.

---

## Section 5: Security

### Q18: What security measures are implemented?
**A:**
1. **Password hashing** with bcrypt (10 salt rounds)
2. **JWT authentication** with 24-hour expiry
3. **Protected routes** via API Gateway middleware
4. **Input validation** using express-validator
5. **CORS configuration** to control cross-origin access
6. **Environment variables** for secrets (never hardcoded)

### Q19: What are the security risks and how are they mitigated?
**A:**
- **SQL/NoSQL injection**: Mitigated by Mongoose schema validation and parameterized queries
- **XSS attacks**: React automatically escapes output
- **CSRF**: JWT in Authorization header (not cookies) prevents CSRF
- **Brute force**: Rate limiting can be added at the API Gateway
- **Data exposure**: Password field excluded from JSON responses using `toJSON()` method

---

## Section 6: Common Errors & Troubleshooting

### E1: MongoDB connection refused
**Fix**: Ensure MongoDB is running. Run `mongod` or start the MongoDB service. Check the `MONGO_URI` in `.env` files.

### E2: Port already in use
**Fix**: Kill the process using the port: `npx kill-port 4000` or change the port in `.env`.

### E3: CORS error in browser
**Fix**: Ensure `cors()` middleware is applied in each service and the API Gateway.

### E4: JWT token invalid/expired
**Fix**: Login again to get a fresh token. Check that `JWT_SECRET` is the same across API Gateway and User Service.

### E5: Docker containers not communicating
**Fix**: Ensure all services are on the same Docker network. Use Docker service names (not `localhost`) for inter-service URLs in docker-compose.yml.

### E6: Restaurant data empty
**Fix**: Run the seed script: `cd services/restaurant-service && npm run seed`
