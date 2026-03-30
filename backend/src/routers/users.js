import { Router } from 'express';
import {
  getProfile, updateProfile,
  changePassword, uploadPhoto, deleteAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.patch('/upload-photo', upload.single('photo'), uploadPhoto);
router.delete('/delete-account', deleteAccount);

export default router;