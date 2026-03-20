import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/stats', protect, authorize('admin'), orderController.getOrderStats);
router.get('/:id', protect, orderController.getOrderById);
router.post('/', protect, orderController.createOrder);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);
router.put('/:id/payment', protect, authorize('admin'), orderController.updatePaymentStatus);
router.delete('/:id', protect, orderController.cancelOrder);

export default router;
