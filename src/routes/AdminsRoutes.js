import express from 'express';
import {
    getAdmins,
    getAdminById,
    createAdmin,
    // updateAdmin,
    deleteAdmin,
} from '../controllers/Admins.js';
import { } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/admins', getAdmins);
router.get('/admins/:id', getAdminById);
router.post('/admins', createAdmin);
// router.patch('/admins/:id',    updateAdmin);
router.delete('/admins/:id', deleteAdmin);

export default router;