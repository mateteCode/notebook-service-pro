import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { CustomerSearch } from "../components/CustomerSearch";
import { Monitor, User, ClipboardList } from "lucide-react";
import type { IUser } from "../../../api/src/core/interfaces/IUser";

export const NewRepairPage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    serialNumber: "",
    faultDescription: "",
    processor: "",
    ram: "",
    storage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return alert("Debes seleccionar un cliente");

    // Extraemos el ID sin importar si viene como _id (MongoDB) o id (TypeScript)
    const validCustomerId = (customer as any)._id || customer.id;

    if (!validCustomerId) {
      console.error("Objeto cliente defectuoso:", customer);
      return alert(
        "Error: El cliente seleccionado no tiene un ID válido. Revisá la consola.",
      );
    }

    try {
      await api.post("/repairs", {
        ownerId: validCustomerId,
        ...formData,
        specifications: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
        },
      });
      navigate("/dashboard"); // Volvemos al panel principal
    } catch (err) {
      alert("Error al registrar el ingreso");
      console.log(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Orden de Ingreso
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN 1: CLIENTE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold">
            <User size={20} /> <span>Datos del Cliente</span>
          </div>
          <CustomerSearch onSelect={(c) => setCustomer(c)} />
          {customer && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium">
                Cliente: {customer.fullName}
              </p>
              <p className="text-xs text-gray-500">Email: {customer.email}</p>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: EQUIPO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-green-600 font-bold">
            <Monitor size={20} /> <span>Especificaciones del Equipo</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Marca (ej: Dell)"
              className="p-2 border rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
            <input
              placeholder="Modelo (ej: Inspiron 15)"
              className="p-2 border rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              required
            />
            <input
              placeholder="Número de Serie"
              className="p-2 border rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* SECCIÓN 3: DIAGNÓSTICO INICIAL */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold">
            <ClipboardList size={20} /> <span>Falla Reportada</span>
          </div>
          <textarea
            placeholder="¿Qué problema presenta el equipo?"
            className="w-full p-3 border rounded-lg h-32"
            onChange={(e) =>
              setFormData({ ...formData, faultDescription: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Registrar Ingreso y Generar Ticket
        </button>
      </form>
    </div>
  );
};
