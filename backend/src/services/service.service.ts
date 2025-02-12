import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { UserModel } from "../models/user.model";
import { Service } from "../types";


export class ServiceService {
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

    return await service.save();
  }

  static async update(serviceId: string, serviceData: Partial<Service>): Promise<Service | null> {
    const updatedService = await ServiceModel.findOneAndUpdate(
        { _id: serviceId, active: true },  // Only update if the service is active
        { ...serviceData, updatedAt: new Date() }, // Update 'updatedAt' field
        { new: true }
    );
    if (updatedService) {
        await BookingModel.updateMany(
            { serviceId }, 
            { serviceName: updatedService.name, updatedAt: new Date() } // Update 'updatedAt' in bookings as well
        );
    }
    return updatedService;
  }

  static async delete(serviceId: string): Promise<void> {
    const existingBookings = await BookingModel.find({ serviceId });
    if (existingBookings.length > 0) {
      throw new Error('Service cannot be deleted because it has active bookings. Delete the bookings first.');
    }
    await ServiceModel.findByIdAndUpdate(serviceId, { active: false, deletedAt: new Date()});
  }

  static async getAll(filters: any = {}): Promise<Service[]> {
    return await ServiceModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<Service | null> {
    return await ServiceModel.findById(id).where({ active: true });
  }
}
