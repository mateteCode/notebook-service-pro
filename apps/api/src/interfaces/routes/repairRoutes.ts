import { Router } from "express";
import { RepairController } from "../controllers/RepairController.ts";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.ts";
import { UserRole } from "../../core/interfaces/IUser.ts";

const router = Router();

router.get("/", authenticate, RepairController.getAll);

router.get("/:id", authenticate, RepairController.getById);

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

router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.TECHNICIAN]),
  RepairController.createEntry,
);

router.post("/:repairId/parts", authenticate, RepairController.addPartToRepair);

export default router;
