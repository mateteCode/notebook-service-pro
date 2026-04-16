import type { Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/UserModel.ts";
import { PasswordHasher } from "../../infrastructure/utils/PasswordHasher.ts";
import jwt from "jsonwebtoken";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await UserModel.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      // Validar contraseña
      const isMatch = await PasswordHasher.compare(
        password,
        user.password || "",
      );
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      // Generar Token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "8h" },
      );

      res.json({
        token,
        user: { id: user._id, fullName: user.fullName, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
}
