import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { DeviceStatus } from "../../../api/src/core/interfaces/IDevice"; // Compartimos Enums
import {
  Package,
  Send,
  Clipboard,
  History,
  X,
  PlusCircle,
  ImageIcon,
} from "lucide-react";
import { RepairTimeline } from "../components/RepairTimeline";
import { useInventory } from "../hooks/useInventory"; // Necesitamos traer el inventario
import type { IDevice } from "../../../api/src/core/interfaces/IDevice";
import type { IUser } from "../../../api/src/core/interfaces/IUser";
import { Layout } from "../components/Layout.tsx";
import { AxiosError } from "axios";
import { useRef } from "react";
import { Printer } from "lucide-react"; // Importar el ícono
import { RepairTicket } from "../pages/RepairTicket";
import { ImageUploader } from "../components/ImageUploader"; // Importamos el componente

interface IInventoryItem {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  salePrice: number;
  supplier: { name: string };
  compatibleModels: string[];
  minStockAlert: number;
}
interface IPartUsed {
  partId: string;
  name: string;
  quantity: number;
  priceAtTime: number;
}

export const RepairDetailsPage = () => {
  const { id } = useParams();
  const [device, setDevice] = useState<IDevice | null>(null);
  const [diagnostic, setDiagnostic] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para el model de repuestos
  const [showPartsModal, setShowPartsModal] = useState(false);
  const { items: inventoryItems } = useInventory();
  const [partSearch, setPartSearch] = useState("");

  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Esto es un truco clásico de React para imprimir solo una parte específica
    const printContent = ticketRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Recarga para restaurar los eventos de React
    }
  };

  // Envolvemos la carga en useCallback para poder llamarla después de actualizar
  const loadDevice = useCallback(async () => {
    try {
      const { data } = await api.get(`/repairs/${id}`);
      setDevice(data);
      // Solo seteamos el estado inicial. El diagnóstico lo dejamos vacío para nuevas notas
      setStatus(data.currentStatus);
      setCategory(data.commonFaultCategory || "");
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar equipo:", error);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDevice();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadDevice]);

  // --- FUNCIÓN PARA ASIGNAR REPUESTO ---
  const handleAssignPart = async (partId: string) => {
    try {
      await api.post(`/repairs/${id}/parts`, {
        partId,
        quantity: 1, // Por defecto 1, podrías agregar un input de cantidad luego
      });
      alert("Repuesto asignado con éxito. Stock descontado.");
      setShowPartsModal(false);
      loadDevice(); // Recargamos para ver el nuevo presupuesto y la pieza en la lista
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      alert(axiosError.response?.data?.message || "Error al asignar repuesto");
    }
  };

  const handleUpdate = async () => {
    if (!diagnostic.trim())
      return alert("Por favor, ingresá un detalle de lo realizado.");
    try {
      await api.put(`/repairs/${id}/status`, {
        status,
        diagnostic,
        category,
        /*description: `Actualización de estado por técnico: ${status}`,*/
        description: diagnostic,
      });
      //alert("Reparación actualizada y cliente notificado");
      // LIMPIEZA DEL FORMULARIO:
      setDiagnostic(""); // Limpiamos el área de texto
      // RECARGA DE DATOS:
      // Al llamar a loadDevice, se actualiza el historial (timeline) automáticamente
      loadDevice();
    } catch (error) {
      alert("Error al actualizar");
      console.log(error);
    }
  };

  if (loading || !device)
    return (
      <Layout>
        <div className="p-10">Cargando ficha...</div>
      </Layout>
    );

  // Filtramos el inventario para el buscador
  const filteredParts = inventoryItems.filter(
    (item: IInventoryItem) =>
      item.name.toLowerCase().includes(partSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(partSearch.toLowerCase()),
  );

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Info y Historial */}
        <div className="lg:col-span-1 space-y-6">
          {/* Info del Equipo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clipboard size={20} className="text-blue-500" /> Ficha del Equipo
            </h3>
            <div className="text-sm space-y-3">
              <p>
                <b>Equipo:</b> {device.brand} {device.model}
              </p>
              <p>
                <b>S/N:</b> {device.serialNumber}
              </p>
              <p>
                <b>Cliente:</b>{" "}
                {typeof device.ownerId === "object"
                  ? (device.ownerId as IUser).fullName
                  : "Cargando..."}
              </p>
              <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 italic">
                " {device.faultDescription} "
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition"
          >
            <Printer size={18} /> Generar Ticket / PDF
          </button>

          {/* NUEVO: LISTA DE REPUESTOS USADOS Y PRESUPUESTO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Package size={20} className="text-orange-500" /> Cotización
              </h3>
              <span className="text-xl font-bold text-green-600">
                ${device.totalBudget?.toLocaleString("es-AR")}
              </span>
            </div>

            {device.partsUsed && device.partsUsed.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {device.partsUsed.map((part: IPartUsed, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-1"
                  >
                    <span>
                      {part.quantity}x {part.name}
                    </span>
                    <span className="text-gray-600">
                      $
                      {(part.priceAtTime * part.quantity).toLocaleString(
                        "es-AR",
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No hay repuestos asignados aún.
              </p>
            )}
          </div>

          {/* HISTORIAL (Timeline) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <History size={20} className="text-purple-500" /> Línea de Tiempo
            </h3>
            {/* Usamos el componente que ya tenías */}
            <RepairTimeline
              history={device.repairHistory
                .map((h) => ({
                  status: h.status,
                  description: h.description,
                  updatedAt: h.updatedAt.toString(),
                }))
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime(),
                )}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: Panel de Trabajo */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-600">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Actualizar Avance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nuevo Estado
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
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
                  Categoría de Falla
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Motherboard">
                    Motherboard / Microsoldadura
                  </option>
                  <option value="Screen">Pantalla / Video</option>
                  <option value="Battery">Batería / Carga</option>
                  <option value="Software">Software / BIOS</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Qué se hizo en el equipo? (Se enviará al cliente)
              </label>
              <textarea
                rows={5}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Se midieron tensiones en la etapa de entrada. Se detectó corto en el primer mosfet..."
                value={diagnostic}
                onChange={(e) => setDiagnostic(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Send size={18} /> Guardar Cambios y Notificar
              </button>

              <button className="px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-bold hover:bg-orange-50 flex items-center gap-2">
                <Package size={20} /> Repuestos
              </button>
              <button
                onClick={() => setShowPartsModal(true)}
                className="px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-bold hover:bg-orange-50 flex items-center gap-2"
              >
                <Package size={20} /> Asignar Repuesto
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            {/* Tarjeta de Galería Visual */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-blue-600" /> Galería de
                Evidencia
              </h3>

              {/* Grid de Fotos con Relación de Aspecto Cuadrada */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 mb-4">
                {device.images && device.images.length > 0 ? (
                  device.images.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
                    >
                      <img
                        src={img.url}
                        alt="Evidencia"
                        // w-full y h-full con object-cover aseguran que llene el cuadrado sin estirarse
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition duration-500"
                        onClick={() => window.open(img.url, "_blank")}
                      />

                      {/* Badge de Contexto (Recepción/Reparación) */}
                      <div className="absolute top-1 left-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm uppercase">
                          {img.context}
                        </span>
                      </div>

                      {/* Overlay de Info al hacer Hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-[9px] text-white font-medium truncate">
                          {img.uploadedByName}
                        </p>
                        <p className="text-[8px] text-gray-300">
                          {new Date(img.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-10 text-center border-2 border-dashed border-gray-100 rounded-lg">
                    <p className="text-gray-400 text-xs font-medium">
                      No hay fotos cargadas aún
                    </p>
                  </div>
                )}
              </div>

              {/* Botón de Cámara/Subida */}
              <ImageUploader
                deviceId={id}
                context="REPARACION"
                onUploadSuccess={loadDevice}
              />
              <p className="text-[10px] text-gray-400 mt-3 text-center italic">
                Las fotos incluyen firma digital y marca de tiempo.
              </p>
            </div>
          </div>

          {/* Aquí podés agregar la tabla de repuestos ya asignados a esta reparación */}
          {/* --- MODAL DE INVENTARIO --- */}
          {showPartsModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-lg">Buscar en Stock</h3>
                  <button
                    onClick={() => setShowPartsModal(false)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-4 border-b">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
                    className="w-full p-2 border rounded-lg"
                    value={partSearch}
                    onChange={(e) => setPartSearch(e.target.value)}
                  />
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-2">
                  {filteredParts.map((item: IInventoryItem) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:border-blue-500 transition"
                    >
                      <div>
                        <p className="font-bold text-sm text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {item.stock} | Precio: ${item.salePrice}
                        </p>
                      </div>
                      <button
                        disabled={item.stock < 1}
                        onClick={() => handleAssignPart(item._id)}
                        className={`p-2 rounded-lg ${item.stock < 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  ))}
                  {filteredParts.length === 0 && (
                    <p className="text-center text-gray-500 text-sm">
                      No se encontraron repuestos.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="hidden">
          <RepairTicket ref={ticketRef} device={device} />
        </div>
      </div>
    </Layout>
  );
};
