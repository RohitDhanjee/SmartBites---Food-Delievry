# SmartBite AWS Deployment Guide 🚀

Follow these steps to deploy the SmartBite microservices platform on your AWS EC2 instance.

## 1. AWS Security Group Configuration
Ensure your EC2 instance allows incoming traffic on these ports:
- **SSH (22)**: For your access
- **HTTP (80)**: Public web access
- **Frontend (3000)**: React App
- **API Gateway (4000)**: All API requests
- **WebSockets (4005, 4008)**: Tracking & Chat

## 2. Server Setup (Run these on EC2)
Connect to your instance via SSH and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group (optional, to avoid sudo)
sudo usermod -aG docker $USER
# Logout and login again for this to take effect
```

## 3. Deployment Steps
1. **Clone your code**: `git clone <your-repo-url>`
2. **Change to project directory**: `cd smartbite`
3. **Update Frontend IP**: 
   - Open `docker-compose.yml`
   - Change `VITE_API_URL` to `http://YOUR_AWS_PUBLIC_IP:4000`
   - Change `VITE_SOCKET_URL` to `http://YOUR_AWS_PUBLIC_IP:4005`
4. **Build and Run**:
   ```bash
   docker-compose up --build -d
   ```

## 4. Environment Variables Checklist
Ensure all `.env` values are correct for production. For microservices, internal communication (e.g., `http://user-service:4001`) stays the same inside Docker network.

---

### Pro Tip: Nginx Reverse Proxy
For a professional setup, use Nginx to map your domain to port 3000 and proxy `/api` to port 4000.
