import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { UserModel } from "../models/user.model";
import { Service } from "../types";

export class ServiceService {
  private static readonly populateOptions = {
    path: 'serviceProvider',
    select: 'name email'
  };

  static async create(serviceData: Partial<Service>): Promise<Service> {
    if (!serviceData.serviceProviderId) {
      throw new Error("serviceProviderId is required");
    }

    // Validate service provider existence
    const serviceProvider = await UserModel.findOne({ _id: serviceData.serviceProviderId, active: true });
    if (!serviceProvider) {
      throw new Error("Invalid serviceProviderId: Service provider not found or inactive.");
    }

    const service = new ServiceModel({
      ...serviceData,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.save();
    return await service.populate(this.populateOptions);
  }

  static async update(serviceId: string, serviceData: Partial<Service>): Promise<Service | null> {
    const updatedService = await ServiceModel.findOneAndUpdate(
      { _id: serviceId, active: true },
      { ...serviceData, updatedAt: new Date() },
      { new: true }
    ).populate(this.populateOptions);

    if (updatedService) {
      await BookingModel.updateMany(
        { serviceId }, 
        { serviceName: updatedService.name, updatedAt: new Date() }
      );
    }
    return updatedService;
  }

  static async delete(serviceId: string): Promise<void> {
    const existingBookings = await BookingModel.find({ active: true, serviceId });
    if (existingBookings.length > 0) {
      throw new Error('Service cannot be deleted because it has active bookings. Delete the bookings first.');
    }
    await ServiceModel.findByIdAndUpdate(serviceId, { active: false, deletedAt: new Date() });
  }

  static async getAll(filters: any = {}): Promise<Service[]> {
    return await ServiceModel.find({ active: true, ...filters })
      .populate(this.populateOptions);
  }

  static async getById(id: string): Promise<Service | null> {
    return await ServiceModel.findById(id)
      .where({ active: true })
      .populate(this.populateOptions);
  }
}