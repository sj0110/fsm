import { Booking } from '../types';
import { BookingModel } from '../models/booking.model';

export class BookingService {
  static async create(bookingData: Partial<Booking>): Promise<Booking> {
    const booking = new BookingModel({
      ...bookingData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return await booking.save();
  }

  static async update(uuid: string, updates: Partial<Booking>): Promise<Booking | null> {
    return await BookingModel.findOneAndUpdate(
      { id: uuid },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  }

  static async getById(uuid: string): Promise<Booking | null> {
    return await BookingModel.findOne({ id: uuid });
  }

  static async getByCustomer(customerUuid: string): Promise<Booking[]> {
    return await BookingModel.find({ customerId: customerUuid });
  }

  static async getByServiceProvider(serviceProviderUuid: string): Promise<Booking[]> {
    return await BookingModel.find({ serviceProviderId: serviceProviderUuid });
  }
}
