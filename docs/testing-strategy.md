# SmartBite — Testing Strategy

## 1. Testing Levels

### Level 1: Unit Testing (Manual via Postman)
Each service endpoint is tested individually with Postman.

### Level 2: Integration Testing
Inter-service communication tested by placing orders (Order → Payment → Delivery chain).

### Level 3: End-to-End Testing
Full user flow tested through the React frontend: Register → Login → Browse → Order → Track.

### Level 4: Load Testing (Locust)
Automated load testing to verify scalability and performance.

## 2. Postman Testing Guide

### Test Flow:
1. **Register**: POST `http://localhost:4000/api/users/register`
2. **Login**: POST `http://localhost:4000/api/users/login` → Save token
3. **Browse**: GET `http://localhost:4000/api/restaurants`
4. **View Menu**: GET `http://localhost:4000/api/restaurants/menu/:id`
5. **Place Order**: POST `http://localhost:4000/api/orders/create` (with token)
6. **Check Payment**: GET `http://localhost:4000/api/payments/order/:orderId`
7. **Track Delivery**: GET `http://localhost:4000/api/delivery/:orderId`

### Auth Header for Protected Routes:
```
Authorization: Bearer <token_from_login>
```

## 3. Load Testing with Locust

### Setup:
```bash
pip install locust
cd testing
locust -f locustfile.py --host=http://localhost:4000
```

### Open Dashboard:
Navigate to `http://localhost:8089`

### Recommended Test Configuration:
- **Number of users**: 50-100
- **Spawn rate**: 10 users/second
- **Duration**: 2-5 minutes

### Metrics to Capture:
- Requests per second (RPS)
- Response time (median, p95, p99)
- Failure rate
- Total requests handled

## 4. Fault Tolerance Testing

### Test 1: Stop a non-critical service
```bash
docker stop smartbite-payment
# Verify: Orders can still be placed (payment status will be pending)
docker start smartbite-payment
```

### Test 2: Stop a downstream service
```bash
docker stop smartbite-delivery
# Verify: Gateway returns 503 for delivery endpoints
# Other services (user, restaurant) continue working
docker start smartbite-delivery
```

### Test 3: Database isolation
```bash
# Drop one service's database
# Verify: Other services' data is unaffected
```

## 5. WebSocket Testing

### Using browser console:
```javascript
const socket = io('http://localhost:4005');
socket.on('connect', () => console.log('Connected'));
socket.emit('track_order', { orderId: 'YOUR_ORDER_ID' });
socket.on('delivery_update', (data) => console.log('Update:', data));
```

## 6. Health Check Verification

```bash
curl http://localhost:4000/health
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
curl http://localhost:4004/health
curl http://localhost:4005/health
```

All should return `{"status": "healthy"}`.
