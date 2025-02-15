import { UserModel } from "./models/user.model";
import bcrypt from "bcryptjs";

export const createAdminUser = async () => {
  const adminEmail = "admin@ex.com";
  const adminPassword = "hp123";

  try {
    // Check if a user with the admin email exists
    const existingUser = await UserModel.findOne({ email: adminEmail });

    if (existingUser) {
      let updated = false;

      // If user exists but has a different role, update it to admin
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        updated = true;
      }

      // If user exists but is inactive, activate it
      if (!existingUser.active) {
        existingUser.active = true;
        updated = true;
      }

      if (updated) {
        await existingUser.save();
        console.log("Existing user updated to admin and activated");
      } else {
        console.log("Admin user already active with correct role");
      }
    } else {
      // If no admin exists, create a new one
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await UserModel.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        active: true,
      });
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error creating or updating admin user:", error);
  }
};
