/**
 * Define los roles permitidos en el sistema
 * Implementando RBAC (Role Based Access Control)
 */
export enum UserRole {
  ADMIN = "ADMIN",
  TECHNICIAN = "TECHNICIAN",
  STOCK_MANAGER = "STOCK_MANAGER",
  CUSTOMER = "CUSTOMER",
}

export interface IUser {
  id?: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  phoneNumber: string; // Necesario para las notificaciones de WhatsApp
  createdAt: Date;
}
