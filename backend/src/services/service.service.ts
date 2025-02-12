import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { Service } from "../types";


export class ServiceService {
  static async create(serviceData: Partial<Service>): Promise<Service> {
    if (!serviceData.serviceProviderId) {
      throw new Error('serviceProviderId is required');
    }

    const service = new ServiceModel(serviceData);
    return await service.save();
  }

  static async update(serviceId: string, serviceData: Partial<Service>): Promise<Service | null> {
    const updatedService = await ServiceModel.findByIdAndUpdate(serviceId, serviceData, { new: true });
    if (updatedService) {
      await BookingModel.updateMany({ serviceId }, { serviceName: updatedService.name });
    }
    return updatedService;
  }

  static async delete(serviceId: string): Promise<void> {
    const existingBookings = await BookingModel.find({ serviceId });
    if (existingBookings.length > 0) {
      throw new Error('Service cannot be deleted because it has active bookings. Delete the bookings first.');
    }
    await ServiceModel.findByIdAndDelete(serviceId);
  }

  static async getAll(filters: any = {}): Promise<Service[]> {
    return await ServiceModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<Service | null> {
    return await ServiceModel.findById(id).where({ active: true });
  }
}
