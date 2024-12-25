// Importar la instancia de Socket.io desde app.js
import { io } from '../app.js';

// Función para enviar una notificación a todos los usuarios conectados a través de sockets
export function notifyAllUsers(req, res) {
  // Mensaje a enviar
  const message = 'Alguien ha pulsado el botón';

  // Emitir un evento de socket para notificar a todos los clientes
  io.emit('notification', message);

  // Enviar una respuesta al cliente
  res.json({ message: 'Notification sent to all users' });
}
