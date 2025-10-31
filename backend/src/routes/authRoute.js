import express from 'express';
import { signIn, signUp,signOut } from '../controllers/authController.js';

const router = express.Router();

// Signup
router.post('/signup', signUp);

// API Đăng nhập
router.post('/signin', signIn);

// API Đăng xuất
router.post('/signout', signOut);

export default router;