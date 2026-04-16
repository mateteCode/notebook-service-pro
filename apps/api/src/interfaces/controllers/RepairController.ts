import type { Request, Response } from "express";
import { DeviceModel } from "../../infrastructure/models/DeviceModel.ts";
import { DeviceStatus } from "../../core/interfaces/IDevice.ts";

export class RepairController {
  // Crear nuevo ingreso
  static async createEntry(req: Request, res: Response) {
    try {
      const deviceData = req.body;
      const newDevice = new DeviceModel({
        ...deviceData,
        repairHistory: [
          {
            status: DeviceStatus.RECEIVED,
            description: "Equipo recibido en local",
            updatedBy: (req as any).user.id,
          },
        ],
      });

      await newDevice.save();
      res.status(201).json(newDevice);
    } catch (error) {
      res.status(500).json({ message: "Error creating device entry" });
    }
  }

  // Actualizar estado y diagnóstico (Lo que ve el cliente en tiempo real)
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, description, diagnostic, category } = req.body;

      const device = await DeviceModel.findById(id);
      if (!device) return res.status(404).json({ message: "Device not found" });

      // Actualizamos campos principales
      device.currentStatus = status;
      if (diagnostic) device.technicalDiagnostic = diagnostic;
      if (category) device.commonFaultCategory = category;

      // Agregamos al historial para el Timeline
      device.repairHistory.push({
        status,
        description,
        updatedBy: (req as any).user.id,
        updatedAt: new Date(),
      });

      await device.save();

      // TODO: Aquí dispararemos la notificación de WhatsApp/Email en el siguiente Sprint

      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Error updating repair status" });
    }
  }
}
