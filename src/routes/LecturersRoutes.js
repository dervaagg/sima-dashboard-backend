import express from 'express';
import {
    getLecturers,
    getLecturerById,
    createLecturer,
    updateLecturer,
    deleteLecturer,
} from '../controllers/Lecturers.js';
import { } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/lecturers', getLecturers);
router.get('/lecturers/:id', getLecturerById);
router.post('/lecturers', createLecturer);
router.patch('/lecturers/:id', updateLecturer);
router.delete('/lecturers/:id', deleteLecturer);

export default router;