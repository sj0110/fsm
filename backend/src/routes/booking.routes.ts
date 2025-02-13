import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['customer']), BookingController.create);

router.put('/:id', authenticate, authorize(['serviceProvider', 'admin', 'customer']), BookingController.update);

router.get('/', authenticate, authorize(['customer', 'serviceProvider', 'admin']), BookingController.getBookings);

router.delete('/:id', authenticate, authorize(['admin']), BookingController.deleteBooking);

export default router;
