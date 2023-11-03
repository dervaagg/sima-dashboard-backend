import express from 'express';
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from '../controllers/Departments.js';
import { } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.post('/departments', createDepartment);
router.patch('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

export default router;