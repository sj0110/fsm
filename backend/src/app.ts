import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import config from './config';
import { rateLimiter } from './middlewares/rateLimit.middleware';
import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import userRoutes from './routes/user.routes';
import serviceRoutes from './routes/service.routes';

const app = express();
// Convert comma-separated env variable to an array
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      /^http:\/\/192\.168\.1\.\d+:5173$/.test(origin)
    ) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


// Middleware
app.use(helmet());
app.use(cors(corsOptions));
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173', // Default to localhost if not set
//   credentials: true, // Allows cookies and authentication headers
// }));
app.use(express.json());
// app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Database connection
mongoose
  .connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;