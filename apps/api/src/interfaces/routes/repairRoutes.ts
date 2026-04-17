import { Router } from "express";
import { RepairController } from "../controllers/RepairController.ts";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.ts";
import { UserRole } from "../../core/interfaces/IUser.ts";

const router = Router();

router.get("/", authenticate, RepairController.getAll);

// Solo técnicos y admins ingresan equipos
router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.TECHNICIAN]),
  RepairController.createEntry,
);

// Solo técnicos y admins actualizan el estado
router.put(
  "/:id/status",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.TECHNICIAN]),
  RepairController.updateStatus,
);

export default router;
