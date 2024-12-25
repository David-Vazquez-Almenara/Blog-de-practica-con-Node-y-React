import jwt from 'jsonwebtoken';
import config from'../config.js';

// Controlador para verificar si el token es válido
export function verifyToken(req, res) {
  const { token } = req.params;
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, config.app.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido', isAuthenticated: false });
    } else {
      // Si el token es válido, devolvemos true
      console.log("token validado con exito")
      return res.status(200).json({ isAuthenticated: true });
    }
  });
}

export function getUserIdFromToken(req, res) {
  const { token } = req.params;
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, config.app.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido', isAuthenticated: false });
    } else {
      // Si el token es válido, devolvemos el _id del usuario
      const userId = decoded.id;
      console.log("ID del usuario:", userId);
      return res.status(200).json({ userId, isAuthenticated: true });
    }
  });
}
