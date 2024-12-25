import express from 'express';
import miscRouter from './misc-router.js';
import user from './user-router.js';
import auth from './auth-router.js';
import category from './category-router.js';
import post  from './post-router.js';

const router = express.Router();


router.use(miscRouter);

router.use(user);

router.use(auth);

router.use(category);

router.use(post);

export default router;
