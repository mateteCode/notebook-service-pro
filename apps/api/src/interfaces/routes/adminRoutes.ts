import { Router } from "express";
import { AdminController } from "../controllers/AdminController.ts";
import { InventoryController } from "../controllers/InventoryController.ts";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.ts";

const router = Router();

router.post(
  "/backup",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.triggerBackup,
);

router.patch(
  "/bulk-price-update",
  authenticate,
  authorize(["ADMIN"]),
  InventoryController.bulkUpdatePrices,
);

export default router;
