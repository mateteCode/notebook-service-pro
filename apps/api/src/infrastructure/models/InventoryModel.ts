import { Schema, model } from "mongoose";
import type { IInventoryItem } from "../../core/interfaces/IInventory.ts";

const InventorySchema = new Schema<IInventoryItem>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    compatibleModels: [{ type: String }], // Índices para búsquedas rápidas
    stock: { type: Number, default: 0 },
    minStockAlert: { type: Number, default: 2 },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    supplier: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
  },
  {
    timestamps: true, // Esto crea 'createdAt' y 'updatedAt' automáticamente
  },
);

// Índice para buscar repuestos compatibles rápidamente
InventorySchema.index({ compatibleModels: 1 });

export const InventoryModel = model<IInventoryItem>(
  "Inventory",
  InventorySchema,
);
