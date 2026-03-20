import express from 'express';
import * as couponController from '../controllers/couponController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/validate', couponController.validateCoupon);
router.get('/', protect, authorize('admin'), couponController.getCoupons);
router.get('/:id', protect, authorize('admin'), couponController.getCouponById);
router.post('/', protect, authorize('admin'), couponController.createCoupon);
router.put('/:id', protect, authorize('admin'), couponController.updateCoupon);
router.delete('/:id', protect, authorize('admin'), couponController.deleteCoupon);

export default router;
