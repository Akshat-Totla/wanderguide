import { Router } from 'express';
import {
  getAllTours, getFeaturedTours, getTour,
  createTour, updateTour, deleteTour,
  addItineraryDay, updateItinerary,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllTours);
router.get('/featured', getFeaturedTours);
router.get('/:id', getTour);

router.post('/', protect, restrictTo('admin', 'guide'), createTour);
router.patch('/:id', protect, restrictTo('admin', 'guide'), updateTour);
router.delete('/:id', protect, restrictTo('admin'), deleteTour);

router.post('/:id/itinerary', protect, restrictTo('admin', 'guide'), addItineraryDay);
router.put('/:id/itinerary', protect, restrictTo('admin', 'guide'), updateItinerary);

export default router;