import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/Users.js';
import { isOperator, isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/users', isAuthenticated, isOperator, getUsers);
router.get('/users/:id', isAuthenticated, isOperator, getUserById);
router.post('/users', isAuthenticated, isOperator, createUser);
router.patch('/users/:id', isAuthenticated, isOperator, updateUser);
router.delete('/users/:id', isAuthenticated, isOperator, deleteUser);

export default router;
