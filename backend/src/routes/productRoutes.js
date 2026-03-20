import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/categories', productController.getCategories);
router.get('/low-stock', protect, authorize('admin'), productController.getLowStockProducts);
router.get('/stats', protect, authorize('admin'), productController.getProductStats);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, authorize('admin'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

export default router;
