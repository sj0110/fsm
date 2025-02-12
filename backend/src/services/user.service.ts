import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { UserModel } from "../models/user.model";
import { User } from "../types";
import bcrypt from 'bcryptjs';

export class UserService {
  static async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const user = new UserModel(userData);
    return await user.save();
  }

  static async update(userId: string, userData: Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
    if (updatedUser) {
      await BookingModel.updateMany({ customerId: userId }, { customerName: updatedUser.name });
    }
    return updatedUser;
  }

  static async delete(userId: string): Promise<void> {
    const existingBookings = await BookingModel.find({ customerId: userId });
    if (existingBookings.length > 0) {
      throw new Error('User cannot be deleted because they have active bookings. Delete the bookings first.');
    }
    
    const existingServices = await ServiceModel.find({ serviceProviderId: userId });
    if (existingServices.length > 0) {
      throw new Error('Service Provider cannot be deleted because they have active services. Delete the services first.');
    }
    
    await UserModel.findByIdAndDelete(userId);
  }

  static async getAll(filters: any = {}): Promise<User[]> {
    return await UserModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<User | null> {
    return await UserModel.findById(id).where({ active: true });
  }
}
