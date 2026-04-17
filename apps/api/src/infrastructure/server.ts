import express, { type Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

// Importación de rutas
import authRoutes from "../interfaces/routes/authRoutes.ts";
import repairRoutes from "../interfaces/routes/repairRoutes.ts";
import statsRoutes from "../interfaces/routes/statsRoutes.ts";

class Server {
  private app: Application;
  private port: string;

  // Definimos los paths de las rutas para mantener orden
  private apiPaths = {
    auth: "/api/auth",
    repairs: "/api/repairs",
    stats: "/api/stats",
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
    this.app.use(cors());
    this.app.use(express.json()); // Parseo de body a JSON
  }

  routes() {
    // Montamos las rutas en sus respectivos paths
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.repairs, repairRoutes);
    this.app.use(this.apiPaths.stats, statsRoutes);

    this.app.get("/api/health", (req, resentment) => {
      resentment
        .status(200)
        .json({ status: "ok", service: "Notebook Service API" });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
