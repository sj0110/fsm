import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Admin routes
router.post('/', authenticate, authorize(['admin']), ServiceController.create);
router.put('/:uuid', authenticate, authorize(['admin']), ServiceController.update);
router.delete('/:uuid', authenticate, authorize(['admin']), ServiceController.delete);

// Public routes
router.get('/', ServiceController.getAll);
router.get('/:uuid', ServiceController.getById);

export default router;