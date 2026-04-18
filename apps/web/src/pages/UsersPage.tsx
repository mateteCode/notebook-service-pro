import { useState, useEffect } from "react";
import api from "../services/api";
import { Layout } from "../components/Layout";
import { UserRole } from "../../../api/src/core/interfaces/IUser";
import { Users, UserPlus, Edit, Trash2, ShieldCheck } from "lucide-react";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-10 text-center">Cargando base de usuarios...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" /> Gestión de Usuarios
            </h1>
            <p className="text-gray-500 text-sm">
              Administrá el staff técnico y la base de clientes.
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
            <UserPlus size={20} /> Nuevo Usuario
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Nombre / Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u: any) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {u.fullName}
                    </div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleStyle(u.role)}`}
                    >
                      <ShieldCheck size={12} /> {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {u.phoneNumber}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

const getRoleStyle = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "TECHNICIAN":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "STOCK_MANAGER":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};
