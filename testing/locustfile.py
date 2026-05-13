# ============================================================
# SmartBite Load Testing with Locust
# ============================================================
# This script simulates multiple users interacting with
# the SmartBite platform simultaneously.
#
# Usage:
#   pip install locust
#   locust -f locustfile.py --host=http://localhost:4000
#
# Then open http://localhost:8089 in your browser
# to configure and start the load test.
# ============================================================

from locust import HttpUser, task, between, SequentialTaskSet
import json
import random

class SmartBiteUser(HttpUser):
    """Simulates a user browsing restaurants, placing orders."""
    
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    token = None
    user_id = None
    
    def on_start(self):
        """Register and login when user starts."""
        email = f"loadtest_{random.randint(1, 999999)}@test.com"
        
        # Register
        response = self.client.post("/api/users/register", json={
            "name": "Load Test User",
            "email": email,
            "password": "testpass123",
            "phone": "0300-0000000",
            "address": "123 Test Street"
        })
        
        if response.status_code == 201:
            data = response.json()
            self.token = data["data"]["token"]
            self.user_id = data["data"]["user"]["_id"]
    
    def get_headers(self):
        """Return auth headers."""
        if self.token:
            return {"Authorization": f"Bearer {self.token}"}
        return {}
    
    @task(5)
    def browse_restaurants(self):
        """Most common action: browse restaurants."""
        self.client.get("/api/restaurants")
    
    @task(3)
    def view_menu(self):
        """View a restaurant's menu."""
        # First get restaurants
        response = self.client.get("/api/restaurants")
        if response.status_code == 200:
            restaurants = response.json().get("data", [])
            if restaurants:
                restaurant = random.choice(restaurants)
                self.client.get(f"/api/restaurants/menu/{restaurant['_id']}")
    
    @task(1)
    def place_order(self):
        """Place an order (least frequent but most important)."""
        if not self.token:
            return
        
        self.client.post("/api/orders/create", 
            json={
                "restaurantId": "test_restaurant",
                "restaurantName": "Test Restaurant",
                "items": [
                    {"name": "Test Burger", "price": 500, "quantity": 2}
                ],
                "totalAmount": 1000,
                "deliveryAddress": "123 Test Street",
                "paymentMethod": "card"
            },
            headers=self.get_headers()
        )
    
    @task(2)
    def check_health(self):
        """Check API Gateway health."""
        self.client.get("/health")
    
    @task(2)
    def view_orders(self):
        """View order history."""
        if not self.token or not self.user_id:
            return
        self.client.get(
            f"/api/orders/user/{self.user_id}",
            headers=self.get_headers()
        )
