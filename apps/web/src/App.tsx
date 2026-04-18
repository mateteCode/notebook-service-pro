import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NewRepairPage } from "./pages/NewRepairPage";
import { DashboardPage } from "./pages/DashboardPage"; // Importar
import { InventoryPage } from "./pages/InventoryPage"; // Importar
import { StatsPage } from "./pages/StatsPage"; // Importar
import { RepairDetailsPage } from "./pages/RepairDetailsPage"; // Importar
import { UsersPage } from "./pages/UsersPage";
import { CustomerRepairsPage } from "./pages/CustomerRepairsPage";

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
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "STOCK_MANAGER"]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stats"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <StatsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/repairs/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
                <RepairDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/new-repair"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
                <NewRepairPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta para Clientes */}
          <Route
            path="/my-repairs"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerRepairsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<div className="p-10">404 - Página no encontrada</div>}
          />
          <Route
            path="/new-repair"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
                <NewRepairPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-repairs"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <CustomerRepairsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
