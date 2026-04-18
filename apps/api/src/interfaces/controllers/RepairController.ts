import type { Request, Response } from "express";
import { DeviceModel } from "../../infrastructure/models/DeviceModel.ts";
import { DeviceStatus } from "../../core/interfaces/IDevice.ts";
import { NotificationService } from "../../use-cases/NotifyClient.ts";
import { UserModel } from "../../infrastructure/models/UserModel.ts";
import { InventoryModel } from "../../infrastructure/models/InventoryModel.ts";

export class RepairController {
  // Crear nuevo ingreso
  static async createEntry(req: Request, res: Response) {
    try {
      const deviceData = req.body;
      if (!deviceData.ownerId) {
        return res.status(400).json({
          message:
            "Rechazado: El ownerId del cliente es obligatorio y no fue recibido.",
        });
      }
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
      console.error("❌ Error al crear ingreso en DB:", error);
      res.status(500).json({ message: "Error creating device entry" });
    }
  }

  // Actualizar estado y diagnóstico (Lo que ve el cliente en tiempo real)
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, description, diagnostic, category } = req.body;

      // Hacemos populate de ownerId para obtener los datos del cliente (IUser)
      //const device = await DeviceModel.findById(id).populate("ownerId");
      const device = await DeviceModel.findById(id);
      if (!device) return res.status(404).json({ message: "Device not found" });

      // Actualizamos campos principales
      device.currentStatus = status;
      if (diagnostic) device.technicalDiagnostic = diagnostic;
      if (category) device.commonFaultCategory = category;

      //const owner = device.ownerId as any;

      // Agregamos al historial para el Timeline
      device.repairHistory.push({
        status,
        description,
        /*updatedBy: (req as any).user.id as string,*/
        updatedBy: (req as any).user.id,
        updatedAt: new Date(),
      });

      await device.save();

      //await device.populate("ownerId");
      //const owner = device.ownerId as any;
      const owner = await UserModel.findById(device.ownerId);

      // Disparar notificación asíncrona (no bloquea la respuesta del servidor)
      // Verificación de seguridad antes de enviar
      console.log("DATOS DEL OWNER:", device.ownerId);
      if (owner && owner.phoneNumber) {
        NotificationService.notifyStatusChange({
          to: owner.phoneNumber,
          customerName: owner.fullName,
          deviceName: `${device.brand} ${device.model}`,
          status: status,
          link: `https://tuapp.com/track/${device._id}`,
        });
      } else {
        console.error(
          "❌ No se pudo enviar la notificación: Datos del cliente incompletos.",
        );
      }
      /*
      NotificationService.notifyStatusChange({
        to: owner.phoneNumber, // Asumiendo que hiciste el populate del owner
        customerName: owner.fullName,
        deviceName: `${device.brand} ${device.model}`,
        status: status,
        link: `https://tuapp.com/track/${device._id}`,
      });*/

      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Error updating repair status" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user; // Obtenemos el usuario del token
      let filter = {};
      if (user.role === "CUSTOMER") {
        filter = { ownerId: user.id };
      }

      console.log(`🔍 Buscando reparaciones para el rol: ${user.role}`);
      console.log(`🎯 Filtro aplicado:`, filter);

      // Usamos .populate('ownerId') para que nos traiga los datos del cliente y no solo el ID
      const repairs = await DeviceModel.find(filter)
        .populate("ownerId", "fullName email phoneNumber")
        .sort({ createdAt: -1 });

      console.log(`✅ Resultados encontrados: ${repairs.length}`);

      res.json(repairs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener reparaciones" });
    }
  }

  static async addPartToRepair(req: Request, res: Response) {
    try {
      const { repairId } = req.params;
      const { partId, quantity = 1 } = req.body;

      // 1. Buscar el repuesto y validar stock
      const part = await InventoryModel.findById(partId);
      if (!part || part.stock < quantity) {
        return res
          .status(400)
          .json({ message: "Stock insuficiente o repuesto no encontrado" });
      }

      // 2. Buscar la reparación
      const repair = await DeviceModel.findById(repairId);
      if (!repair)
        return res.status(404).json({ message: "Reparación no encontrada" });

      // 3. DESCONTAR STOCK (Operación atómica)
      part.stock -= quantity;
      await part.save();

      // 4. ASIGNAR A LA REPARACIÓN
      // Añadimos el repuesto al array de piezas usadas y actualizamos el costo total
      repair.partsUsed.push({
        partId: part._id.toString(),
        name: part.name,
        priceAtTime: part.salePrice, // Guardamos el precio del momento por la inflación
        quantity,
      });

      repair.totalBudget += part.salePrice * quantity;

      await repair.save();

      res.json({ message: "Repuesto asignado correctamente", repair });
    } catch (error) {
      res.status(500).json({ message: "Error al asignar repuesto" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Buscamos la reparación y poblamos los datos del cliente y los repuestos
      const repair = await DeviceModel.findById(id)
        .populate("ownerId", "fullName email phoneNumber")
        .populate("partsUsed.partId", "name sku");

      if (!repair) {
        return res.status(404).json({ message: "Reparación no encontrada" });
      }

      res.json(repair);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la reparación" });
    }
  }
}
