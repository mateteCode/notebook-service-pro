import { Router } from "express";
import { AdminController } from "../controllers/AdminController.js";
import { InventoryController } from "../controllers/InventoryController.js";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.js";

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
