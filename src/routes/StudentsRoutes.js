import express from 'express';
import {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../controllers/Students.js';
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/students', isAuthenticated, getStudents);
router.get('/student/:id', isAuthenticated, getStudentById);
router.post('/student', isAuthenticated, createStudent);
router.patch('/student/:id', isAuthenticated, updateStudent);
router.delete('/student/:id', isAuthenticated, deleteStudent);

export default router;