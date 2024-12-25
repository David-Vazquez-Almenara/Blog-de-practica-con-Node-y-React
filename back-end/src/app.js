import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { init } from './loaders/index.js'; // Importa la función de inicialización de la aplicación
import config from './config.js';

const app = express();
const server = http.createServer(app); // Crea un servidor HTTP utilizando Express

// Configura Socket.io en el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Inicializa la aplicación Express y pasa la instancia de app y la configuración
init(app, config);

// Exporta la instancia de Socket.io para que pueda ser utilizada en otros módulos
export { io };

// Exporta la aplicación Express
export default app;
