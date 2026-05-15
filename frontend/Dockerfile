FROM node:18-alpine
WORKDIR /app

# Accept build-time arguments for API URLs
ARG VITE_API_URL
ARG VITE_SOCKET_URL

# Set as environment variables (available at runtime for dev server)
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm install
COPY . .

# Create .env file AFTER copy so it won't be overwritten
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && \
    echo "VITE_SOCKET_URL=$VITE_SOCKET_URL" >> .env

EXPOSE 3000
CMD ["npm", "run", "dev"]
