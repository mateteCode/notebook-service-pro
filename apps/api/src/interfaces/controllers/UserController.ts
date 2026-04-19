import type { Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/UserModel.js";
import { PasswordHasher } from "../../infrastructure/utils/PasswordHasher.js";

export class UserController {
  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      // Buscamos por nombre o email
      const filter = {
        $or: [
          { fullName: { $regex: String(q), $options: "i" } },
          { email: { $regex: String(q), $options: "i" } },
        ],
        role: "CUSTOMER",
      };

      const users = await UserModel.find(filter).limit(5);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error searching users" });
    }
  }

  // CREATE (Ya tenemos register, pero esto es para que el Admin cree técnicos)
  static async create(req: Request, res: Response) {
    try {
      const { password, ...userData } = req.body;
      const hashedPassword = await PasswordHasher.hash(password);

      const newUser = new UserModel({
        ...userData,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error });
    }
  }

  // READ
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserModel.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  // UPDATE
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      }).select("-password");
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Error updating user" });
    }
  }

  // DELETE
  static async delete(req: Request, res: Response) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting user" });
    }
  }
}
