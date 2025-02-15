import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { UserModel } from "../models/user.model";
import { Booking } from "../types";

export class BookingService {
  // Fields that the bookings and services data is to be populated with.
  private static readonly populateOptions = [
    { path: 'customer', select: 'name email' },
    { path: 'service', select: 'name description price' },
    { path: 'serviceProvider', select: 'name email' }
  ];

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
  
    await booking.save();
    return await booking.populate(this.populateOptions); // populates the data when fetch call is made with relevant populate options defined using the populate function
  }

  static async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: id, active: true },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    return booking ? booking.populate(this.populateOptions) : null;
  }

  static async getById(id: string): Promise<Booking | null> {
    return await BookingModel.findOne({ _id: id, active: true })
      .populate(this.populateOptions);
  }

  static async getByCustomer(customerId: string): Promise<Booking[]> {
    return await BookingModel.find({ customerId, active: true })
      .populate(this.populateOptions);
  }

  static async getAll(): Promise<Booking[]> {
    return await BookingModel.find({ active: true })
      .populate(this.populateOptions);
  }

  static async getByServiceProvider(serviceProviderId: string): Promise<Booking[]> {
    return await BookingModel.find({ serviceProviderId, active: true })
      .populate(this.populateOptions);
  }

  static async delete(id: string): Promise<void> {
    await BookingModel.findByIdAndUpdate(id, { active: false, deletedAt: new Date() });
  }
}