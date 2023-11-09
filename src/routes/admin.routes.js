import express from 'express';
import {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
} from '../controllers/admin.controller.js';
import { isAuthenticated } from '../middleware/authUser.js/index.js';

const router = express.Router();

router.get('/admins', isAuthenticated, getAdmins);
router.get('/admin/:id', isAuthenticated, getAdminById);
router.post('/admin', isAuthenticated, createAdmin);
router.patch('/admin/:id', isAuthenticated, updateAdmin);
router.delete('/admin/:id', isAuthenticated, deleteAdmin);

export default router;