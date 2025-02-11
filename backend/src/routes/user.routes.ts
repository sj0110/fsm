import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Admin only routes
router.post('/', authenticate, authorize(['admin']), UserController.create);
router.put('/:id', authenticate, authorize(['admin']), UserController.update);
router.delete('/:id', authenticate, authorize(['admin']), UserController.delete);
router.get('/', authenticate, authorize(['admin']), UserController.getAll);
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);

export default router;
