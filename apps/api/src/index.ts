import dotenv from "dotenv";
import Server from "./infrastructure/server.js";

// Configurar variables de entorno antes de arrancar
dotenv.config();

// Instanciar y arrancar el servidor
new Server().listen();
