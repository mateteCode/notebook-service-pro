import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

class Server {
  private app: Application;
  private port: string;

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
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json()); // Parseo de body a JSON
  }

  routes() {
    // Aquí irán las rutas más adelante
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
