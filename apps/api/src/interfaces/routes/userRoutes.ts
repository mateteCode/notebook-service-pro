import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.ts";

const router = Router();

// Endpoint para buscar clientes (el que te dio 404)
router.get("/search", authenticate, UserController.search);

export default router;
