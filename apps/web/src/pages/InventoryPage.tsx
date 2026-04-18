import React, { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { /*Package,*/ AlertTriangle, Plus, Search, Edit } from "lucide-react";
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

  if (loading)
    return (
      <Layout>
        <div className="p-10">Cargando inventario...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Control de Repuestos e Insumos
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
              {items.map((item: InventoryItem) => (
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
