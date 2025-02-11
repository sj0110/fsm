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

  static async update(id: string, updates: Partial<Service>): Promise<Service | null> {
    return await ServiceModel.findByIdAndUpdate(id, updates, { new: true });
  }

  static async delete(id: string): Promise<void> {
    await ServiceModel.findByIdAndUpdate(id, { active: false });
  }

  static async getAll(filters: any = {}): Promise<Service[]> {
    return await ServiceModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<Service | null> {
    return await ServiceModel.findById(id).where({ active: true });
  }
}
