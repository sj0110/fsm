import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.PORT);
console.log(process.env.MONGO_URI);
console.log(process.env.JWT_SECRET);
console.log(process.env.NODE_ENV);
const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/service-booking',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  environment: process.env.NODE_ENV || 'development',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100 // requests per window
}

export default config