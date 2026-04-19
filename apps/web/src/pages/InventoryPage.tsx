import React, { useState, useEffect } from "react";
import { useInventory } from "../hooks/useInventory";
import api from "../services/api";
import {
  /*Package,*/ AlertTriangle,
  Plus,
  Search,
  Edit,
  X,
  Trash2,
} from "lucide-react";
import { Layout } from "../components/Layout";

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  supplier: { name: string };
  compatibleModels: string[];
  stock: number;
  minStockAlert: number;
  salePrice: number;
}

export const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { items, loading } = useInventory() as {
    items: InventoryItem[];
    loading: boolean;
  };

  // Estados para el Modal y Proveedores
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    costPrice: 0,
    salePrice: 0,
    stock: 0,
    minStockAlert: 2,
    supplier: "",
    location: "",
  });

  // Cargar proveedores para el select del formulario
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await api.get("/suppliers");
        setSuppliers(data);
      } catch (error) {
        console.error("Error al cargar proveedores", error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/inventory", formData);
      alert("Repuesto guardado con éxito");
      setShowModal(false);
      refetch(); // Recargamos la tabla
      // Limpiamos el formulario
      setFormData({
        name: "",
        sku: "",
        category: "",
        costPrice: 0,
        salePrice: 0,
        stock: 0,
        minStockAlert: 2,
        supplier: "",
        location: "",
      });
    } catch (error: any) {
      alert(
        "Error al guardar el repuesto. Verificá que el SKU no esté repetido.",
      );
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de dar de baja este repuesto?")) return;
    try {
      await api.delete(`/inventory/${id}`);
      refetch();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-10">Cargando inventario...</div>
      </Layout>
    );

  // Filtrado local en el frontend
  const filteredItems = items.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Control de Repuestos e Insumos
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Nuevo Repuesto
          </button>
        </div>

        {/* Buscador inteligente por modelo compatible */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por repuesto o modelo de notebook compatible (ej: Dell 3505)..."
            className="w-full pl-10 p-2 border rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla de Inventario */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Repuesto</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Compatibilidad
                </th>
                <th className="px-6 py-4 text-center font-semibold">Stock</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Precio Venta
                </th>
                <th className="px-6 py-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item: InventoryItem) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      SKU: {item.sku} | Prov: {item.supplier.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.compatibleModels.slice(0, 2).map((m: string) => (
                        <span
                          key={m}
                          className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock <= item.minStockAlert
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.stock <= item.minStockAlert && (
                        <AlertTriangle size={12} className="mr-1" />
                      )}
                      {item.stock} unidades
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-700">
                    ${item.salePrice.toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <p className="text-center p-6 text-gray-500">
              No se encontraron repuestos.
            </p>
          )}
        </div>

        {/* MODAL DE NUEVO REPUESTO */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800">
                  Alta de Nuevo Repuesto
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 overflow-y-auto space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre / Descripción
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ej: Pantalla LED 15.6 30 pines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código SKU
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 uppercase"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="PAN-156-30P"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Pantallas">Pantallas</option>
                      <option value="Baterías">Baterías</option>
                      <option value="Teclados">Teclados</option>
                      <option value="Componentes SMD">Componentes SMD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor
                    </label>
                    <select
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                    >
                      <option value="">Seleccionar proveedor...</option>
                      {suppliers.map((sup) => (
                        <option key={sup._id} value={sup._id}>
                          {sup.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costo (ARS)
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.costPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          costPrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Sugerido Venta (ARS)
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.salePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salePrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Inicial
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alerta de Stock Mínimo
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={formData.minStockAlert}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStockAlert: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t mt-6">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Guardar en Inventario
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
