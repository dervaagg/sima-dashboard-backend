import express from 'express';
import AuthRouter from './auth.routes.js';
import UsersRouter from './user.routes.js';
import adminsRoutes from './admin.routes.js';
import departmentsRoutes from './department.routes.js';
import lecturersRoutes from './lecturer.routes.js';
import studentsRoutes from './student.routes.js';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/', UsersRouter);
router.use(adminsRoutes);
router.use(departmentsRoutes);
router.use(lecturersRoutes);
router.use(studentsRoutes);

export default router;