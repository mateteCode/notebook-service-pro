import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas para Técnicos y Admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
                <h1 className="p-10 text-2xl">Dashboard de Taller</h1>
              </ProtectedRoute>
            }
          />

          {/* Ruta para Clientes */}
          <Route
            path="/my-repairs"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <h1 className="p-10 text-2xl">Mis Reparaciones</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<div className="p-10">404 - Página no encontrada</div>}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
