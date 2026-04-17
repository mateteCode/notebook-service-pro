import type { Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/UserModel.ts";

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
}
