import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js";
import { verifyUser, operatorOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/users', verifyUser, operatorOnly, getUsers);
router.get('/users/:id', verifyUser, operatorOnly, getUserById);
router.post('/users', verifyUser, operatorOnly, createUser);
router.patch('/users/:id', verifyUser, operatorOnly, updateUser);
router.delete('/users/:id', verifyUser, operatorOnly, deleteUser);

export default router;