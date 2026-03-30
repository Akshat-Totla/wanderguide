import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/:tourId', addToWishlist);
router.delete('/:tourId', removeFromWishlist);

export default router;