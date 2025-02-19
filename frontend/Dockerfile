# Stage 1: Build the React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the app's source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:1.25-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static files
RUN rm -rf ./*

# Copy built app from the previous stage
COPY --from=builder /app/dist ./

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx runs on
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
