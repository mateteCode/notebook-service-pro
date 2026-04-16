// En: apps/web/src/components/RepairTimeline.tsx

import { CheckCircle, Clock /*Tool*/ } from "lucide-react"; // Iconos copados

interface HistoryItem {
  status: string;
  description: string;
  updatedAt: string;
}

export const RepairTimeline = ({ history }: { history: HistoryItem[] }) => {
  return (
    <div className="flex flex-col space-y-4">
      {history.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-4 border-l-2 border-blue-500 bg-gray-50"
        >
          <div className="mt-1">
            {index === 0 ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <Clock className="text-blue-500" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800">{item.status}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
            <span className="text-xs text-gray-400">
              {new Date(item.updatedAt).toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
