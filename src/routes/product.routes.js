import { Router } from 'express';
import { createProduct, deleteProduct, listProducts } from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listProducts);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);
export default router;