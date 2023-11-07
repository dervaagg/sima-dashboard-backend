import express from 'express';
import { login, logout, me } from '../controllers/Auth.js';
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/me', isAuthenticated, me);
router.post('/login', login);
router.delete('/logout', logout);

export default router;