import { useStats } from "../hooks/useStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  TrendingDown,
  AlertCircle /*, PieChart as PieIcon*/,
} from "lucide-react";
import { Layout } from "../components/Layout";

interface FaultStat {
  fault: string;
  model: string;
  occurrences: number;
}

export const StatsPage = () => {
  const { faultStats, loading } = useStats();

  // Colores para las barras basados en la severidad o tipo
  const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];

  if (loading) return <div className="p-10">Analizando base de datos...</div>;

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">
            Inteligencia de Taller
          </h1>
          <p className="text-gray-500 text-sm">
            Análisis de fallas recurrentes y fiabilidad de hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Barras: Fallas por Categoría */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingDown className="text-blue-500" /> Frecuencia de Fallas
              por Categoría
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faultStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="fault" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="occurrences" radius={[4, 4, 0, 0]}>
                    {faultStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla de Modelos con más fallas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="text-red-500" /> Modelos Críticos
              Detectados
            </h3>
            <div className="space-y-4">
              {faultStats.slice(0, 5).map((stat: FaultStat, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{stat.model}</p>
                    <p className="text-xs text-gray-500">
                      Falla predominante: {stat.fault}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-600">
                      {stat.occurrences} casos
                    </span>
                    <div className="w-24 bg-gray-200 h-1.5 rounded-full mt-1">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{
                          width: `${(stat.occurrences / (faultStats[0] as FaultStat).occurrences) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
