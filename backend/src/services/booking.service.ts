import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { UserModel } from "../models/user.model";
import { Booking } from "../types";

export class BookingService {
  static async create(bookingData: { serviceId: string; appointmentDate: Date; notes?: string }, customerId: string): Promise<Booking> {
    // Validate customer existence
    const customer = await UserModel.findOne({ _id: customerId, active: true });
    if (!customer) {
      throw new Error("Invalid customer: Customer not found or inactive.");
    }
  
    // Validate service existence and fetch service provider ID
    const service = await ServiceModel.findOne({ _id: bookingData.serviceId, active: true });
    if (!service) {
      throw new Error("Invalid serviceId: Service not found or inactive.");
    }
  
    // Validate service provider existence
    const serviceProvider = await UserModel.findOne({ _id: service.serviceProviderId, active: true });
    if (!serviceProvider) {
      throw new Error("Invalid service provider: Not found or inactive.");
    }
  
    const booking = new BookingModel({
      serviceId: bookingData.serviceId,
      serviceProviderId: service.serviceProviderId,
      customerId,
      appointmentDate: bookingData.appointmentDate,
      notes: bookingData.notes,
      status: 'pending',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  
    return await booking.save();
  }
  


  static async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    return await BookingModel.findOneAndUpdate(
      { _id: id, active: true },  // Ensuring only active bookings can be updated
      { ...updates, updatedAt: new Date() }, // Update 'updatedAt' field
      { new: true }
    );
  }

  static async getById(id: string): Promise<Booking | null> {
    return await BookingModel.findOne({ _id: id, active: true });  // Fetch only active booking
  }

  static async getByCustomer(customerId: string): Promise<Booking[]> {
    return await BookingModel.find({ customerId, active: true });  // Fetch only active bookings
  }

  static async getAll(): Promise<Booking[]> {
    return await BookingModel.find({ active: true });  // Fetch only active bookings
  }

  static async getByServiceProvider(serviceProviderId: string): Promise<Booking[]> {
    return await BookingModel.find({ serviceProviderId, active: true });  // Fetch only active bookings
  }

  static async delete(id: string): Promise<void> {
    await BookingModel.findByIdAndUpdate(id, { active: false, deletedAt: new Date() });
  }
}
