// En: apps/api/src/seed.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "./infrastructure/models/UserModel.ts";
import { UserRole } from "./core/interfaces/IUser.ts";
import { PasswordHasher } from "./infrastructure/utils/PasswordHasher.ts";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");

    // Verificamos si ya existe el admin para no duplicar
    const adminExists = await UserModel.findOne({ role: UserRole.ADMIN });

    if (!adminExists) {
      const hashedPassword = await PasswordHasher.hash("admin123"); // Contraseña temporal

      const admin = new UserModel({
        email: "admin@taller.com",
        password: hashedPassword,
        fullName: "Admin General",
        role: UserRole.ADMIN,
        phoneNumber: "1122334455",
      });

      await admin.save();
      console.log("✅ Admin user created: admin@taller.com / admin123");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};

seedAdmin();
