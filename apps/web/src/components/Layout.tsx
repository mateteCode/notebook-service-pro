import { useAuth } from "../context/useAuth";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <span className="font-bold text-blue-600">Notebook Service Pro</span>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar Sesión
        </button>
      </nav>
      <main>{children}</main>
    </div>
  );
};
