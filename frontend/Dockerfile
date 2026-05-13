FROM node:18-alpine
WORKDIR /app

# Accept build-time arguments for API URLs
ARG VITE_API_URL=http://localhost:4000
ARG VITE_SOCKET_URL=http://localhost:4005

# Create .env file that Vite will read at startup
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && \
    echo "VITE_SOCKET_URL=$VITE_SOCKET_URL" >> .env

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
