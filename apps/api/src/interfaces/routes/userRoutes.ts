import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.js";

const router = Router();

// Endpoint para buscar clientes (el que te dio 404)
router.get("/search", authenticate, UserController.search);
router.get("/", authenticate, authorize(["ADMIN"]), UserController.getAll);
router.post("/", authenticate, authorize(["ADMIN"]), UserController.create);
router.put("/:id", authenticate, authorize(["ADMIN"]), UserController.update);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  UserController.delete,
);

export default router;
