# Stage 1: Build the React App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy all project files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the App with Nginx
FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy built React app from previous stage
COPY --from=builder /app/dist ./

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
