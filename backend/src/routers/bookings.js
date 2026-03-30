import { Router } from 'express';
import {
  createBooking, getMyBookings, getBooking,
  cancelBooking, getAllBookings,
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect); // all booking routes require auth

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/admin/all', restrictTo('admin'), getAllBookings);
router.get('/:id', getBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;