# Stage 1: Build the React App
FROM node:20-alpine AS builder
ENV VITE_API_URL="https://backend-100121385070.asia-south1.run.app"
ENV VITE_JWT_SECRET="6478ca95561347c5e1d50876ded171a18ca94d6b2285cb97f9c3ea682ac41e116cb667e9f4e7cd0b94314034ea1a36119d1d101153fbee6d9e3aaaca1c20f9f4a36362ccf43b791fc6ab2ffa43cbe032e9c2b05eee01f9ac629106fea2a20782519fe8d2de250e5f3d3285608d7e3a3d7eb7841bfd3c3c2910423e1e4d4e4b3b273ad2c6a8203b513142c1ddbce5961fa8348b29ebd011751d5bc9f57bb70c4e2a6630fd5966096e2059e147ada1da9ab54a8c42a8ccdafcadf10a5dda869a120ec6f5d8a8ab635bf9450061846df83479097065f6a48ea6292bb4a098931a27b335d372bc58b5e5ff9a90a4495f18526c47d21b7d42361be2385c0ad96773f337bf053ce282beedd21efdc5bb9e511272917fac5907eee4d8bb2b1ef24b607d90f6f7c8f2ec642267c78daa6d58f9c99709c7f7eb68307629fca5b22d71567a59e20741b5df12395e1043af9eb96c43f76efe0763fd5edccfff26aaaf973a796d8637483cc261dc0cfc24d73c560fec8a4ab2f89c2abc5308cb65a918fe2e0d55414fdd68c5976f808445fa5cec837c0ebc8bce51c6f141d3e9473f4b3344a2cca3d893eb9785db8c1f9fb40d9ee0ad1a9ce0dc98feaa0b5c0ea2543d430b6db031973e6c804dbeecee7b476873cb148fc9f0240d56e1a8813705f456a9f99e6a6635846d1269f8d482db12bfeb9cd23c0f148fda24961e118ea35b7f3c1e07"
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
