import { InventoryModel } from "../infrastructure/models/InventoryModel.ts";
import { DeviceModel } from "../infrastructure/models/DeviceModel.ts";

/**
 * Servicio para asignar repuestos a una reparación
 * Maneja la lógica de descontar stock y actualizar el costo de la reparación
 */
export class InventoryAssignment {
  static async attachPartToRepair(
    deviceId: string,
    partId: string,
    quantity: number = 1,
  ) {
    // 1. Buscamos el repuesto
    const part = await InventoryModel.findById(partId);
    if (!part || part.stock < quantity) {
      throw new Error("Insufficient stock or part not found");
    }

    // 2. Descontamos stock (Operación Atómica)
    part.stock -= quantity;
    await part.save();

    // 3. Lo vinculamos a la reparación
    // Agregamos el costo del repuesto al historial o a un campo de "partsUsed"
    const device = await DeviceModel.findByIdAndUpdate(
      deviceId,
      {
        $push: {
          partsUsed: {
            partId,
            name: part.name,
            costAtTime: part.salePrice,
            quantity,
          },
        },
      },
      { new: true },
    );

    return { device, remainingStock: part.stock };
  }
}
