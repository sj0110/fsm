import { Service } from '../types';
import { ServiceModel } from '../models/service.model';

export class ServiceService {
  static async create(serviceData: Partial<Service>): Promise<Service> {
    // Ensure serviceProviderId is passed as a uuid
    if (!serviceData.serviceProviderId) {
      throw new Error('serviceProviderId (UUID) is required');
    }

    const service = new ServiceModel(serviceData);
    return await service.save();
  }

  static async update(uuid: string, updates: Partial<Service>): Promise<Service | null> {
    return await ServiceModel.findOneAndUpdate({ id: uuid }, updates, { new: true });
  }

  static async delete(uuid: string): Promise<void> {
    await ServiceModel.findOneAndUpdate({ id: uuid }, { active: false });
  }

  static async getAll(filters: any = {}): Promise<Service[]> {
    return await ServiceModel.find({ active: true, ...filters });
  }

  static async getById(uuid: string): Promise<Service | null> {
    return await ServiceModel.findOne({ id: uuid, active: true });
  }
}
