import express from 'express';
import {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../controllers/student.controller.js';
import { isAuthenticated } from '../middleware/authUser.js/index.js';

const router = express.Router();

router.get('/students', isAuthenticated, getStudents);
router.get('/student/:id', isAuthenticated, getStudentById);
router.post('/student', isAuthenticated, createStudent);
router.patch('/student/:id', isAuthenticated, updateStudent);
router.delete('/student/:id', isAuthenticated, deleteStudent);

export default router;