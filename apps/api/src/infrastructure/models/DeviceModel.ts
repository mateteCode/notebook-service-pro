// En: apps/api/src/infrastructure/models/DeviceModel.ts

import { Schema, model } from "mongoose";
import { type IDevice, DeviceStatus } from "../../core/interfaces/IDevice.ts";

const DeviceSchema = new Schema<IDevice>(
  {
    ownerId: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, required: true },
    specifications: {
      processor: { type: String },
      ram: { type: String },
      storage: { type: String },
    },
    currentStatus: {
      type: String,
      enum: Object.values(DeviceStatus),
      default: DeviceStatus.RECEIVED,
    },
    faultDescription: { type: String, required: true }, // Lo que dice el cliente
    technicalDiagnostic: { type: String }, // Llenado por el técnico
    commonFaultCategory: { type: String }, // Ej: "Motherboard", "Pantalla", "Software"

    // El historial que verá el cliente en su Timeline
    repairHistory: [
      {
        status: { type: String, enum: Object.values(DeviceStatus) },
        description: { type: String }, // Ej: "Se procedió a la limpieza de coolers"
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Índice para estadísticas rápidas por modelo y falla
DeviceSchema.index({ model: 1, commonFaultCategory: 1 });

export const DeviceModel = model<IDevice>("Device", DeviceSchema);
