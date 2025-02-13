import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BookingService } from '../services/booking.service';

export class BookingController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?._id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      const { serviceId, appointmentDate, notes } = req.body;
      if (!serviceId || !appointmentDate) {
        res.status(400).json({ message: 'Service ID and appointment date are required' });
        return;
      }
  
      const booking = await BookingService.create({ serviceId, appointmentDate, notes }, req.user._id);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  


  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user;
      
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;
      }

      let booking = await BookingService.getById(id);

      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }

      if(user?.role.toString() === 'customer' && (booking.customerId.toString() !== user?._id.toString() || booking.status.toString() !== 'pending'))
      {
        res.status(403).json({ message: 'You cannot update this booking' });
        return;
      }

      if(user?.role.toString() === 'customer')
      {
        booking = await BookingService.update(id, {status: 'cancelled'})
      }


      await BookingService.update(id, req.body);
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
        bookings = await BookingService.getAll();
      }
      res.json(bookings);
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }

  static async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user;

      const booking = await BookingService.getById(id);
      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }

      await BookingService.delete(id);
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(401).json({ message: err.message });
    }
  }
}

