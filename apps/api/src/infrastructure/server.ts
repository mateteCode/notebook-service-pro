import express, { type Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

// Importación de rutas
import authRoutes from "../interfaces/routes/authRoutes.js";
import repairRoutes from "../interfaces/routes/repairRoutes.js";
import statsRoutes from "../interfaces/routes/statsRoutes.js";
import userRoutes from "../interfaces/routes/userRoutes.js";
import adminRoutes from "../interfaces/routes/adminRoutes.js";
import supplierRoutes from "../interfaces/routes/supplierRoutes.js";
import inventoryRoutes from "../interfaces/routes/inventoryRoutes.js";

class Server {
  private app: Application;
  private port: string;

  // Definimos los paths de las rutas para mantener orden
  private apiPaths = {
    auth: "/api/auth",
    repairs: "/api/repairs",
    stats: "/api/stats",
    users: "/api/users",
    admin: "/api/admin",
    suppliers: "/api/suppliers",
    inventory: "/api/inventory",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    this.connectDB();
    this.middlewares();
    this.routes();
  }

  // Conexión a MongoDB usando Mongoose
  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI || "");
      console.log("✅ Database connected");
    } catch (error) {
      console.error("❌ Database connection error:", error);
      process.exit(1); // Cerramos el proceso si no hay DB
    }
  }

  middlewares() {
    //this.app.use(cors());
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173", // Para que te siga funcionando cuando codeas en tu PC
          "https://notebook-service-pro.vercel.app", // ¡Tu URL real de Vercel!
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"], // Clave para que deje pasar el Token y el JSON
        credentials: true, // Fundamental para que pasen los Tokens JWT en los headers
      }),
    );
    this.app.use(express.json()); // Parseo de body a JSON
  }

  routes() {
    // Montamos las rutas en sus respectivos paths
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.repairs, repairRoutes);
    this.app.use(this.apiPaths.stats, statsRoutes);
    this.app.use(this.apiPaths.users, userRoutes);
    this.app.use(this.apiPaths.admin, adminRoutes);
    this.app.use(this.apiPaths.suppliers, supplierRoutes);
    this.app.use(this.apiPaths.inventory, inventoryRoutes);

    // Ruta de salud

    this.app.get("/api/health", (req, res) => {
      res.status(200).json({ status: "ok", service: "Notebook Service API" });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
