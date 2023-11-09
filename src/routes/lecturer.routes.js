import express from 'express';
import {
    getLecturers,
    getLecturerById,
    createLecturer,
    updateLecturer,
    deleteLecturer,
} from '../controllers/lecturer.controller.js';
import { isAuthenticated } from '../middleware/authUser.js/index.js';

const router = express.Router();

router.get('/lecturers', isAuthenticated, getLecturers);
router.get('/lecturer/:id', isAuthenticated, getLecturerById);
router.post('/lecturer', isAuthenticated, createLecturer);
router.patch('/lecturer/:id', isAuthenticated, updateLecturer);
router.delete('/lecturer/:id', isAuthenticated, deleteLecturer);

export default router;