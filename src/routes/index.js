import express from 'express';
import AuthRouter from './AuthRoutes.js';
import UsersRouter from './UsersRoutes.js';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/', UsersRouter);



export default router;
