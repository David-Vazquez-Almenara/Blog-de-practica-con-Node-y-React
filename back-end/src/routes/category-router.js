import { Router } from 'express';
import  { createCategory, getCategories,getAllCategories, getCategoryById, updateCategory, deleteCategory, deleteCategoryByUser } from '../controllers/category-controller.js'

const router = Router();


router.post('/category/create', createCategory);

router.get('/category/data/name/:name', getCategories);

router.get('/category/data/', getAllCategories);

router.get('/category/data/id/:id', getCategoryById);

router.put('/category/update/id/:id', updateCategory);

router.delete('/category/delete/:id',  deleteCategory);

router.post('/category/deleteByUser',  deleteCategoryByUser);

export default router;
