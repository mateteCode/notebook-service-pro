import type { Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/UserModel.js";
import { PasswordHasher } from "../../infrastructure/utils/PasswordHasher.js";
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

  static async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, role, phoneNumber } = req.body;

      // 1. Verificar si el usuario ya existe
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // 2. Hashear la contraseña (usando el utilitario que creamos)
      const hashedPassword = await PasswordHasher.hash(password);

      // 3. Crear el nuevo usuario
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        fullName,
        role: role || "CUSTOMER", // Por defecto es cliente si no se aclara
        phoneNumber,
      });

      await newUser.save();

      // 4. (Opcional) Generar token para que el usuario quede logueado tras registrarse
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "8h" },
      );

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error en el servidor al registrar usuario" });
    }
  }
}
