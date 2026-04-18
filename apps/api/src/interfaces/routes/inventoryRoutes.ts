import { Router } from "express";
import { InventoryController } from "../controllers/InventoryController.ts";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.ts";

const router = Router();

router.get("/", authenticate, InventoryController.getAll);
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  InventoryController.create,
);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  InventoryController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  InventoryController.delete,
);
router.patch(
  "/bulk-price-update",
  authenticate,
  authorize(["ADMIN"]),
  InventoryController.bulkUpdatePrices,
);

export default router;
