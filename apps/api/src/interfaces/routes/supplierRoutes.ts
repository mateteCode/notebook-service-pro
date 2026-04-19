import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController.js";
import { authenticate, authorize } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/", authenticate, SupplierController.getAll);
router.post("/", authenticate, authorize(["ADMIN"]), SupplierController.create);
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  SupplierController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  SupplierController.delete,
);

export default router;
