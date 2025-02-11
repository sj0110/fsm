import bcrypt from 'bcryptjs';
import { User } from '../types';
import { UserModel } from '../models/user.model';

export class UserService {
  static async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const user = new UserModel(userData);
    return await user.save();
  }

  static async update(uuid: string, updates: Partial<User>): Promise<User | null> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    return await UserModel.findOneAndUpdate({ uuid }, updates, { new: true });
  }

  static async delete(uuid: string): Promise<void> {
    await UserModel.findOneAndUpdate({ uuid }, { active: false });
  }

  static async getAll(filters: any = {}): Promise<User[]> {
    return await UserModel.find({ active: true, ...filters });
  }

  static async getById(uuid: string): Promise<User | null> {
    return await UserModel.findOne({ uuid, active: true });
  }
}
