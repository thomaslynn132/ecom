import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/', protect, authorize('admin'), reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/product/:productId', protect, reviewController.createReview);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, authorize('admin'), reviewController.deleteReview);
router.patch('/:id/approve', protect, authorize('admin'), reviewController.approveReview);

export default router;
