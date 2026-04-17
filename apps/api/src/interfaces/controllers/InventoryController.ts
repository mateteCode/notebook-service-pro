import type { Request, Response } from "express";
import { InventoryModel } from "../../infrastructure/models/InventoryModel.ts";

export class InventoryController {
  static async bulkUpdatePrices(req: Request, res: Response) {
    try {
      const { percentage, category, supplierId } = req.body;

      if (!percentage || isNaN(percentage)) {
        return res.status(400).json({ message: "Porcentaje inválido" });
      }

      // Construimos el filtro dinámicamente
      const filter: any = {};
      if (category) filter.category = category;
      if (supplierId) filter.supplier = supplierId;

      // Calculamos el multiplicador (ej: 10% aumenta -> 1.10)
      const multiplier = 1 + percentage / 100;

      // Usamos updateMany con una pipeline de agregación para actualizar en base al valor actual
      const result = await InventoryModel.updateMany(filter, [
        {
          $set: {
            salePrice: {
              $round: [{ $multiply: ["$salePrice", multiplier] }, 0],
            },
            costPrice: {
              $round: [{ $multiply: ["$costPrice", multiplier] }, 0],
            },
          },
        },
      ]);

      res.json({
        message: "Precios actualizados con éxito",
        affectedItems: result.modifiedCount,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al actualizar precios masivamente" });
    }
  }
}
