import express from 'express';
import {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from '../controllers/department.controller.js';
import { isAuthenticated } from '../middleware/authUser.js/index.js';

const router = express.Router();

router.get('/departments', isAuthenticated, getDepartments);
router.get('/department/:id', isAuthenticated, getDepartmentById);
router.post('/department', isAuthenticated, createDepartment);
router.patch('/department/:id', isAuthenticated, updateDepartment);
router.delete('/department/:id', isAuthenticated, deleteDepartment);

export default router;