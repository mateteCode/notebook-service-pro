import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  LogOut,
  PlusCircle,
} from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      roles: ["ADMIN", "TECHNICIAN"],
    },
    {
      name: "Inventario",
      icon: <Package size={20} />,
      path: "/inventory",
      roles: ["ADMIN", "STOCK_MANAGER", "TECHNICIAN"],
    },
    {
      name: "Clientes",
      icon: <Users size={20} />,
      path: "/users",
      roles: ["ADMIN"],
    },
    {
      name: "Estadísticas",
      icon: <BarChart3 size={20} />,
      path: "/stats",
      roles: ["ADMIN"],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-800 text-blue-400">
          Service Pro
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(
            (item) =>
              user &&
              item.roles.includes(user.role) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition"
                >
                  {item.icon} {item.name}
                </Link>
              ),
          )}
        </nav>
        <button
          onClick={logout}
          className="p-6 flex items-center gap-3 hover:bg-red-900/20 text-red-400 border-t border-slate-800 transition"
        >
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <div className="text-sm text-gray-500">
            Bienvenido,{" "}
            <span className="font-bold text-gray-700">{user?.fullName}</span> (
            {user?.role})
          </div>
          <button
            onClick={() => navigate("/new-repair")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Nuevo Ingreso
          </button>
        </header>
        <main className="p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
