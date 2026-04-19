import type { Request, Response } from "express";
import { SupplierModel } from "../../infrastructure/models/SupplierModel.js";

export class SupplierController {
  // CREATE
  static async create(req: Request, res: Response) {
    try {
      const newSupplier = new SupplierModel(req.body);
      await newSupplier.save();
      res.status(201).json(newSupplier);
    } catch (error) {
      res.status(400).json({ message: "Error creating supplier", error });
    }
  }

  // READ (Listar todos)
  static async getAll(req: Request, res: Response) {
    try {
      const suppliers = await SupplierModel.find({ active: true });
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching suppliers" });
    }
  }

  // UPDATE
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await SupplierModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated)
        return res.status(404).json({ message: "Supplier not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Error updating supplier" });
    }
  }

  // DELETE (Soft Delete para mantener integridad referencial)
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await SupplierModel.findByIdAndUpdate(
        id,
        { active: false },
        { new: true },
      );
      if (!deleted)
        return res.status(404).json({ message: "Supplier not found" });
      res.json({ message: "Supplier deactivated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting supplier" });
    }
  }
}
