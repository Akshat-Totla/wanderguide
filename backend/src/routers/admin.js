import { Router } from 'express';
import { getStats, getAllUsers, updateUserRole, deleteUser } from '../controllers/adminController.js';
import { getAllBookings } from '../controllers/bookingController.js';
import {
  getAllTours, createTour, updateTour, deleteTour,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getStats);

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/bookings', getAllBookings);

router.get('/tours', getAllTours);
router.post('/tours', createTour);
router.patch('/tours/:id', updateTour);
router.delete('/tours/:id', deleteTour);

export default router;