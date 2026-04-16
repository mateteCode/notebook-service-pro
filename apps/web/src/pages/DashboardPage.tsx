import { useRepairs } from "../hooks/useRepairs";
import { RepairTable } from "../components/RepairTable";
import { Layout } from "../components/Layout"; // Un componente Wrapper con Sidebar
import { type IDevice } from "../../../api/src/core/interfaces/IDevice";

export const DashboardPage = () => {
  const { repairs, loading } = useRepairs();

  if (loading) return <div className="p-10">Cargando taller...</div>;

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Control de Taller
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Nuevo Ingreso
          </button>
        </div>

        {/* Resumen de Estados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">En Diagnóstico</p>
            <p className="text-2xl font-bold">
              {
                repairs.filter((r: IDevice) => r.currentStatus === "DIAGNOSING")
                  .length
              }
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Esperando Repuestos</p>
            <p className="text-2xl font-bold">
              {
                repairs.filter(
                  (r: IDevice) => r.currentStatus === "WAITING_PARTS",
                ).length
              }
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Listos para Retirar</p>
            <p className="text-2xl font-bold">
              {
                repairs.filter((r: IDevice) => r.currentStatus === "READY")
                  .length
              }
            </p>
          </div>
        </div>

        <RepairTable repairs={repairs} />
      </div>
    </Layout>
  );
};
