import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/Users.js';
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/users', isAuthenticated, getUsers);
router.get('/user/:id', isAuthenticated, getUserById);
router.post('/user', isAuthenticated, createUser);
router.patch('/user/:id', isAuthenticated, updateUser);
router.delete('/user/:id', isAuthenticated, deleteUser);

export default router;