import { useState, useEffect } from "react";
import api from "../services/api";
import { Layout } from "../components/Layout";
import { Users, UserPlus, Edit, Trash2, ShieldCheck, X } from "lucide-react";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");

  // Estado del Formulario
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "CUSTOMER",
    password: "",
  });

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

  // --- CONTROLADORES DEL MODAL ---
  const handleOpenCreate = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "CUSTOMER",
      password: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (user: any) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      role: user.role,
      password: "", // Se deja vacío por seguridad, se envía solo si el admin escribe algo nuevo
    });
    setEditingId(user._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Al editar, si la contraseña está vacía, la quitamos del payload para no sobrescribirla
        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        await api.put(`/users/${editingId}`, payload);
        alert("Usuario actualizado con éxito");
      } else {
        // Al crear, asumo que usas la ruta /auth/register o una específica /users (ajusta según tu backend)
        await api.post("/users", formData);
        alert("Usuario creado con éxito");
      }
      setShowModal(false);
      fetchUsers(); // Recargar la tabla
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al procesar el usuario");
      console.error(error);
    }
  };

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
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
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
                    {u.phoneNumber || "No registrado"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="text-blue-500 hover:bg-blue-50 p-2 rounded"
                    >
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

        {/* --- MODAL DE CREACIÓN / EDICIÓN --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800">
                  {isEditing ? "Editar Usuario" : "Alta de Nuevo Usuario"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="+54 9 11..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol en el Sistema
                  </label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="CUSTOMER">Cliente</option>
                    <option value="TECHNICIAN">Técnico</option>
                    <option value="STOCK_MANAGER">Gestor de Stock</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing
                      ? "Nueva Contraseña (Opcional)"
                      : "Contraseña (Requerida)"}
                  </label>
                  <input
                    type="password"
                    required={!isEditing}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={
                      isEditing
                        ? "Dejar en blanco para mantener actual"
                        : "Mínimo 6 caracteres"
                    }
                  />
                </div>

                <div className="pt-4 border-t mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    {isEditing ? "Guardar Cambios" : "Crear Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
