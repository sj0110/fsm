import { BookingModel } from "../models/booking.model";
import { Booking } from "../types";

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

  static async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    return await BookingModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  }

  static async getById(id: string): Promise<Booking | null> {
    return await BookingModel.findById(id);
  }

  static async getByCustomer(customerId: string): Promise<Booking[]> {
    return await BookingModel.find({ customerId });
  }

  static async getByServiceProvider(serviceProviderId: string): Promise<Booking[]> {
    return await BookingModel.find({ serviceProviderId });
  }
}
