import { Monitor /*,Smartphone*/ /*,AlertCircle*/, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Repair {
  _id: string;
  brand: string;
  model: string;
  serialNumber: string;
  currentStatus: string;
  ownerId?: {
    fullName: string;
  };
}

export const RepairTable = ({ repairs }: { repairs: Repair[] }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Equipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {repairs.map((repair) => (
            <tr key={repair._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Monitor className="mr-3 text-gray-400" size={20} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {repair.brand} {repair.model}
                    </div>
                    <div className="text-xs text-gray-500">
                      SN: {repair.serialNumber}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {typeof repair.ownerId === "object"
                  ? repair.ownerId?.fullName
                  : "Cliente no asignado"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    repair.currentStatus === "READY"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {repair.currentStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => navigate(`/repairs/${repair._id}`)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-900 font-semibold"
                >
                  <Eye size={16} />
                  Gestionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
