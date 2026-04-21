import { Router } from "express";
import { RepairController } from "../controllers/RepairController.js";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.js";
import { UserRole } from "../../core/interfaces/IUser.js";
import { upload } from "../../infrastructure/config/cloudinary.js";

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

router.post(
  "/:id/images",
  authenticate,
  upload.single("image"),
  RepairController.uploadImage,
);

export default router;
