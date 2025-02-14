import { UserModel } from "./models/user.model";
import bcrypt from 'bcryptjs';

export const createAdminUser = async () => {
  const adminEmail = 'admin@ex.com';
  const adminPassword = 'hp123';

  try {
    // Check if an active admin with the specified email exists
    const existingAdmin = await UserModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      // If the admin exists but is inactive, activate the account
      if (!existingAdmin.active) {
        existingAdmin.active = true;
        await existingAdmin.save();
        console.log('Existing admin user activated');
      } else {
        console.log('Admin user already active');
      }
    } else {
      // If no admin exists, create a new one
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await UserModel.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        active: true,
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating or activating admin user:', error);
  }
};
