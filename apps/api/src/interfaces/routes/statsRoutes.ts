import { Router } from "express";
import { StatsController } from "../controllers/StatsController.js";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.js";
import { UserRole } from "../../core/interfaces/IUser.js";

const router = Router();

// Solo el Admin o Stock Manager debería ver estas métricas de negocio
router.get(
  "/common-faults",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.STOCK_MANAGER]),
  StatsController.getCommonFaults,
);

export default router;
