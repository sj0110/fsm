import { BookingModel } from "../models/booking.model";
import { ServiceModel } from "../models/service.model";
import { UserModel } from "../models/user.model";
import { User } from "../types";
import bcrypt from 'bcryptjs';

export class UserService {
  static async create(userData: Partial<User>): Promise<User> {
    const existingUser = await UserModel.findOne({ email: userData.email });

    if (existingUser) {
      if (!existingUser.active) {
        Object.assign(existingUser, userData, { active: true, updatedAt: new Date() });
        await existingUser.save();
        return existingUser;
      }
      throw new Error("Email already in use by an active user.");
    }

    const newUser = new UserModel({
      ...userData,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await newUser.save();
  }

  static async update(userId: string, userData: Partial<User>): Promise<User | null> {
    // Remove role from update data if it exists
    const { role, ...updateData } = userData;

    // If someone tries to update the role, throw an error
    if (role !== undefined) {
      throw new Error('Role cannot be updated after user creation');
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, active: true },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (updatedUser) {
      await BookingModel.updateMany(
        { customerId: userId },
        { customerName: updatedUser.name, updatedAt: new Date() }
      );
    }
    return updatedUser;
  }

  static async delete(userId: string): Promise<void> {
    const existingBookings = await BookingModel.find({ customerId: userId, active: true });
    if (existingBookings.length > 0) {
      throw new Error('User cannot be deleted because they have active bookings. Delete the bookings first.');
    }
  
    const existingServices = await ServiceModel.find({ serviceProviderId: userId, active: true });
    if (existingServices.length > 0) {
      throw new Error('Service Provider cannot be deleted because they have active services. Delete the services first.');
    }
  
    await UserModel.findByIdAndUpdate(userId, { active: false, deletedAt: new Date() });
  }

  static async getAll(filters: any = {}): Promise<User[]> {
    return await UserModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<User | null> {
    return await UserModel.findById(id).where({ active: true });
  }
}