import dotenv from "dotenv";
import Server from "./infrastructure/server.ts";

// Configurar variables de entorno antes de arrancar nada
dotenv.config();

// Instanciar y arrancar el servidor
const server = new Server();

server.listen();
