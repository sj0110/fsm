import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { createAdminUser } from './create.admin.user';


mongoose
  .connect(config.mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB');
    await createAdminUser();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
