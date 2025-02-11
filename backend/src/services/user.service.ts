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

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    return await UserModel.findByIdAndUpdate(id, updates, { new: true });
  }

  static async delete(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { active: false });
  }

  static async getAll(filters: any = {}): Promise<User[]> {
    return await UserModel.find({ active: true, ...filters });
  }

  static async getById(id: string): Promise<User | null> {
    return await UserModel.findById(id).where({ active: true });
  }
}
