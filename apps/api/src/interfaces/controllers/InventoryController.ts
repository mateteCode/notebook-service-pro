import type { Request, Response } from "express";
import { InventoryModel } from "../../infrastructure/models/InventoryModel.js";

export class InventoryController {
  // CREATE
  static async create(req: Request, res: Response) {
    try {
      const newItem = new InventoryModel(req.body);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ message: "Error creating item", error });
    }
  }

  // READ (Listar todos con datos del proveedor)
  static async getAll(req: Request, res: Response) {
    try {
      const items = await InventoryModel.find({ active: true }).populate(
        "supplier",
        "name",
      );
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching inventory" });
    }
  }

  // UPDATE
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await InventoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: "Item not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Error updating item" });
    }
  }

  // DELETE (Soft Delete)
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await InventoryModel.findByIdAndUpdate(id, { active: false });
      res.json({ message: "Item deactivated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting item" });
    }
  }

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
