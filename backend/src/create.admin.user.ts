import { UserModel } from "./models/user.model";
import bcrypt from 'bcryptjs';

export const createAdminUser = async () => {
    try {
        const adminExists = await UserModel.findOne({ role: 'admin' });
        if (!adminExists) {
          const hashedPassword = await bcrypt.hash('hp123', 10); // Hash password before storing
          await UserModel.create({
            name: 'Admin',
            email: 'admin@ex.com',
            password: hashedPassword,
            role: 'admin',
          });
          console.log('Admin user created');
        }
      } catch (error) {
        console.error('Error creating admin user:', error);
      }
}
