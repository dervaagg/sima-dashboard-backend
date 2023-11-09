import express from 'express';
import { login, logout, me } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middleware/authUser.js/index.js';

const router = express.Router();

router.get('/me', isAuthenticated, me);
router.post('/login', login);
router.delete('/logout', logout);

export default router;