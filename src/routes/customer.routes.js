import { Router } from 'express';
import { createCustomer, getCustomer, listCustomers, updateCustomer } from '../controllers/customer.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listCustomers);
router.post('/', createCustomer);
router.get('/:id', getCustomer);
router.patch('/:id', updateCustomer);
export default router;