// apps/web/src/pages/CustomerRepairsPage.tsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { Layout } from "../components/Layout";
import { RepairTimeline } from "../components/RepairTimeline";
import { Laptop, AlertCircle, ImageIcon } from "lucide-react";
import type { IDevice } from "../../../api/src/core/interfaces/IDevice";

export const CustomerRepairsPage = () => {
  const [myRepairs, setMyRepairs] = useState<IDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRepairs = async () => {
      try {
        const { data } = await api.get("/repairs"); // Gracias al filtro del backend, solo trae los suyos
        setMyRepairs(data);
      } catch (error) {
        console.error("Error fetching my repairs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRepairs();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Buscando tus equipos...</div>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Mis Equipos en Taller
        </h1>
        <p className="text-gray-500 mb-8">
          Hacé el seguimiento en tiempo real de tus reparaciones.
        </p>

        {myRepairs.length === 0 ? (
          <div className="bg-blue-50 text-blue-800 p-6 rounded-xl flex items-center gap-3">
            <AlertCircle /> No tenés ningún equipo ingresado actualmente.
          </div>
        ) : (
          <div className="space-y-8">
            {myRepairs.map((repair) => (
              <div
                key={repair.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                {/* Encabezado del Equipo */}
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Laptop className="text-blue-400" />
                    <div>
                      <h2 className="font-bold text-lg">
                        {repair.brand} {repair.model}
                      </h2>
                      <p className="text-xs text-slate-300">
                        S/N: {repair.serialNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-inner">
                      {repair.currentStatus}
                    </span>
                  </div>
                </div>

                {/* Cuerpo: Presupuesto y Timeline */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
                      Diagnóstico Actual
                    </h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg italic">
                      {repair.technicalDiagnostic ||
                        "En revisión por nuestro equipo técnico..."}
                    </p>

                    <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm font-bold text-green-800">
                        Presupuesto Estimado:
                      </p>
                      <p className="text-2xl font-black text-green-600">
                        ${repair.totalBudget?.toLocaleString("es-AR")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
                      Historial de Avances
                    </h3>
                    <div className="max-h-64 overflow-y-auto pr-2">
                      <RepairTimeline
                        history={repair.repairHistory.sort(
                          (a, b) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime(),
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-4">
                  {/* Tarjeta de Galería Visual */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                      <ImageIcon size={20} className="text-blue-600" /> Galería
                      de Evidencia
                    </h3>

                    {/* Grid de Fotos con Relación de Aspecto Cuadrada */}
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 mb-4">
                      {repair.images && repair.images.length > 0 ? (
                        repair.images.map((img: any, idx: number) => (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
