import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BookingService } from '../services/booking.service';

export class BookingController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      // console.log('Authenticated User:', req.user);
      if (!req.user?._id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const booking = await BookingService.create({
        ...req.body,
        customerId: req.user._id
      });

      res.status(201).json(booking);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;
      }

      const booking = await BookingService.update(id, req.body);
      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      res.json(booking);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async getBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      let bookings;
      if (req.user?.role === 'customer') {
        bookings = await BookingService.getByCustomer(req.user._id);
      } else if (req.user?.role === 'serviceProvider') {
        bookings = await BookingService.getByServiceProvider(req.user._id);
      } else {
        bookings = await BookingService.getByCustomer(req.params.customerId);
      }
      res.json(bookings);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }
}

