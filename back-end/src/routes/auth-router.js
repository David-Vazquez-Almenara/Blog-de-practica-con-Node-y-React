import { Router } from 'express';
import { verifyToken, getUserIdFromToken } from '../controllers/token-controller.js'; // Importa la función verifyToken como una exportación nombrada

const router = Router();

// Ruta para verificar si el token es válido
router.get('/auth/token/:token', verifyToken);


router.get('/getID/token/:token', getUserIdFromToken);


export default router;
