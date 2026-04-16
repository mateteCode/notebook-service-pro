// En: apps/web/src/pages/RepairDetailsPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { DeviceStatus } from "../../../api/src/core/interfaces/IDevice"; // Compartimos Enums
import { Package, Send /*, Tool*/, Clipboard } from "lucide-react";
import type { IDevice } from "../../../api/src/core/interfaces/IDevice";
import type { IUser } from "../../../api/src/core/interfaces/IUser";

export const RepairDetailsPage = () => {
  const { id } = useParams();
  const [device, setDevice] = useState<IDevice | null>(null);
  const [diagnostic, setDiagnostic] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  // Cargar datos del equipo
  useEffect(() => {
    const loadDevice = async () => {
      const { data } = await api.get(`/repairs/${id}`);
      setDevice(data);
      setDiagnostic(data.technicalDiagnostic || "");
      setStatus(data.currentStatus);
      setCategory(data.commonFaultCategory || "");
    };
    loadDevice();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/repairs/${id}/status`, {
        status,
        diagnostic,
        category,
        description: `Actualización de estado por técnico: ${status}`,
      });
      alert("Reparación actualizada y cliente notificado");
    } catch (error) {
      alert("Error al actualizar");
      console.log(error);
    }
  };

  if (!device) return <div className="p-10">Cargando ficha...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Columna Izquierda: Información del Equipo y Cliente */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clipboard size={20} className="text-blue-500" /> Datos del Equipo
          </h3>
          <div className="text-sm space-y-2">
            <p>
              <b>Marca/Modelo:</b> {device.brand} {device.model}
            </p>
            <p>
              <b>S/N:</b> {device.serialNumber}
            </p>
            <p>
              <b>Cliente:</b>{" "}
              {device.ownerId && typeof device.ownerId === "object"
                ? (device.ownerId as IUser).fullName
                : "N/A"}
            </p>
            <hr />
            <p className="text-gray-600 italic">
              " {device.faultDescription} "
            </p>
          </div>
        </div>

        {/* Sección de Repuestos Usados */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package size={20} className="text-orange-500" /> Repuestos
          </h3>
          <button className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 text-sm">
            + Asignar Repuesto de Stock
          </button>
          {/* Mapeo de device.usedParts aquí */}
        </div>
      </div>

      {/* Columna Derecha: Acciones de Taller */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Panel de Diagnóstico
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Actual
              </label>
              <select
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.values(DeviceStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría de Falla (Estadística)
              </label>
              <select
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Seleccionar categoría...</option>
                <option value="Motherboard">
                  Motherboard / Microelectrónica
                </option>
                <option value="Screen">Pantalla / Flex</option>
                <option value="Battery">Batería / Alimentación</option>
                <option value="Software">Software / OS</option>
                <option value="Keyboard">Teclado / Touchpad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Informe Técnico (Interno)
              </label>
              <textarea
                rows={6}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describí los hallazgos técnicos y pruebas realizadas..."
                value={diagnostic}
                onChange={(e) => setDiagnostic(e.target.value)}
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition"
            >
              <Send size={18} /> Guardar Cambios y Notificar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
