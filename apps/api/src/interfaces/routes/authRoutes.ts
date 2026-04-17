import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

const router = Router();

// Ruta de Login
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;
