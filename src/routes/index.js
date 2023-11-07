import express from 'express';
import AuthRouter from './AuthRoutes.js';
import UsersRouter from './UsersRoutes.js';
import adminsRoutes from './AdminsRoutes.js';
import departmentsRoutes from './DepartmentsRoutes.js';
import lecturersRoutes from './LecturersRoutes.js';
import studentsRoutes from './StudentsRoutes.js';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/', UsersRouter);
router.use(adminsRoutes);
router.use(departmentsRoutes);
router.use(lecturersRoutes);
router.use(studentsRoutes);

export default router;