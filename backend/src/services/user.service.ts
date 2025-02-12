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
        // Reactivate user and update with new data
        if (userData.password) {
          userData.password = await bcrypt.hash(userData.password, 10);
        }

        Object.assign(existingUser, userData, { active: true, updatedAt: new Date() });
        await existingUser.save();
        return existingUser;
      }
      throw new Error("Email already in use by an active user.");
    }

    // Hash password before creating a new user
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Create a new user
    const newUser = new UserModel({
      ...userData,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await newUser.save();
  }


  static async update(userId: string, userData: Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, active: true },  // Only update if the user is active
      { ...userData, updatedAt: new Date() }, // Update 'updatedAt' field
      { new: true }
    );
    if (updatedUser) {
      await BookingModel.updateMany(
        { customerId: userId },
        { customerName: updatedUser.name, updatedAt: new Date() } // Update 'updatedAt' in bookings as well
      );
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

    await UserModel.findByIdAndUpdate(userId, { active: false, deletedAt: new Date() });
  }

  static async getAll(filters: any = {}): Promise<User[]> {
    return await UserModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<User | null> {
    return await UserModel.findById(id).where({ active: true });
  }
}
