import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, logout, refresh, getMe } from '../controllers/authcontroller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

export default router;