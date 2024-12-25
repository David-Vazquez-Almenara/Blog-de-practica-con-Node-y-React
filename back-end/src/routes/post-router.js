import { Router } from 'express';
import  { createPost, getPosts, getPostById, updatePost, deletePost   } from '../controllers/post-controller.js'


const router = Router();


router.post('/post/create', createPost);

router.get('/post/data/name/:name', getPosts);

router.get('/post/data/id/:id', getPostById);

router.put('/post/update/id/:id', updatePost);

router.delete('/post/delete/:id',  deletePost);

export default router;
