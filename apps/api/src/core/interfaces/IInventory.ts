export interface ISupplier {
  name: string;
  contactName?: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface IInventoryItem {
  id?: string;
  sku: string; // Código único de stock
  name: string; // Ej: Pantalla LED 15.6" 30 pins
  description?: string;
  brand: string; // Marca del repuesto
  compatibleModels: string[]; // Array de modelos (Ej: ["Dell 3501", "Dell 3505"])
  stock: number;
  minStockAlert: number; // Para avisar si queda poco
  costPrice: number; // Lo que nos costó (en ARS o USD)
  salePrice: number; // Precio sugerido de venta
  supplier: ISupplier;
  lastUpdate: Date;
}
