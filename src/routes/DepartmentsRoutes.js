import express from 'express';
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from '../controllers/Departments.js';
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/departments', isAuthenticated, getDepartments);
router.get('/department/:id', isAuthenticated, getDepartmentById);
router.post('/department', isAuthenticated, createDepartment);
router.patch('/department/:id', isAuthenticated, updateDepartment);
router.delete('/department/:id', isAuthenticated, deleteDepartment);

export default router;