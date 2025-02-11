import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

import { authenticate, dummyMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', authenticate, AuthController.logout);

export default router;

// src/routes/booking.routes.ts
