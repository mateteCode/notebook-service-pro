import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { CustomerSearch } from "../components/CustomerSearch";
import type { IUser } from "../../../api/src/core/interfaces/IUser";

export const NewEntryPage = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<IUser | null>(null);
  const [deviceData, setDeviceData] = useState({
    brand: "",
    model: "",
    serialNumber: "",
    processor: "",
    ram: "",
    storage: "",
    faultDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return alert("Por favor, seleccioná un cliente");

    try {
      await api.post("/repairs", {
        ownerId: selectedCustomer.id,
        ...deviceData,
        specifications: {
          processor: deviceData.processor,
          ram: deviceData.ram,
          storage: deviceData.storage,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      alert("Error al registrar el ingreso");
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Nuevo Ingreso a Taller
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección Cliente */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            Cliente / Dueño
          </label>
          <CustomerSearch onSelect={setSelectedCustomer} />
          {selectedCustomer && (
            <p className="mt-2 text-sm text-blue-700">
              Seleccionado: <b>{selectedCustomer.fullName}</b>
            </p>
          )}
        </div>

        {/* Datos del Equipo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setDeviceData({ ...deviceData, brand: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setDeviceData({ ...deviceData, model: e.target.value })
              }
            />
          </div>
        </div>

        {/* Especificaciones Técnicas (Lo que ayuda al diagnóstico) */}
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded">
          <input
            type="text"
            placeholder="Procesador"
            className="p-2 border rounded text-sm"
            onChange={(e) =>
              setDeviceData({ ...deviceData, processor: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="RAM"
            className="p-2 border rounded text-sm"
            onChange={(e) =>
              setDeviceData({ ...deviceData, ram: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Disco"
            className="p-2 border rounded text-sm"
            onChange={(e) =>
              setDeviceData({ ...deviceData, storage: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción del problema
          </label>
          <textarea
            required
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="¿Qué le pasa al equipo?"
            onChange={(e) =>
              setDeviceData({ ...deviceData, faultDescription: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Confirmar Ingreso y Generar Ticket
        </button>
      </form>
    </div>
  );
};
