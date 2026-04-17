import { Schema, model } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    contactName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    category: { type: String }, // ej: "Pila/Baterías", "Pantallas", "Electrónica General"
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const SupplierModel = model("Supplier", SupplierSchema);
