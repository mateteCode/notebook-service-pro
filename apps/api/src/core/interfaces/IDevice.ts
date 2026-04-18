import type { IUser } from "./IUser.ts";

export enum DeviceStatus {
  RECEIVED = "RECEIVED",
  DIAGNOSING = "DIAGNOSING",
  WAITING_PARTS = "WAITING_PARTS",
  REPAIRING = "REPAIRING",
  TESTING = "TESTING",
  READY = "READY",
  DELIVERED = "DELIVERED",
}

export interface IPartUsed {
  partId: string;
  name: string;
  priceAtTime: number;
  quantity: number;
}

export interface IDevice {
  id?: string;
  ownerId: string | IUser; // Referencia al IUser (Customer)
  brand: string; // Ej: Dell, Lenovo
  model: string; // Ej: Inspiron 3505
  serialNumber: string;
  specifications: {
    processor: string;
    ram: string;
    storage: string;
  };
  currentStatus: DeviceStatus;
  faultDescription: string; // Lo que dice el cliente
  technicalDiagnostic?: string; // Lo que encuentra el técnico
  commonFaultCategory?: string; // Para las estadísticas (ej: "Batería", "Bisingas", "BIOS")
  partsUsed: IPartUsed[];
  totalBudget: number;
  repairHistory: {
    status: DeviceStatus;
    description: string;
    updatedAt: Date;
    updatedBy: string; // ID del técnico
  }[];
}
