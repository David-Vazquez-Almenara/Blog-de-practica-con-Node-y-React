import { Router } from 'express';
import {register, login, getUserById, getUserByEmail, updateUserById, getAllUsers,getAllNonClientUsers, updateUserByEmail, deleteUserByEmail} from '../controllers/user-controller.js'

const router = Router();

router.post('/user/register', register);

router.post('/user/login', login);

router.get('/user/data/email/:email', getUserByEmail);
router.get('/user/data/id/:id', getUserById);
router.get('/user/data/all/', getAllUsers);
router.get('/user/data/notClient/', getAllNonClientUsers);
router.put('/user/update/email/:email',updateUserByEmail);
router.put('/user/update/id/:id', updateUserById);

router.delete('/user/delete/:email',  deleteUserByEmail);



export default router;



