// src/routes/invoice.routes.js
import { Router } from 'express';
import { generateVoiceInvoice } from '../controllers/invoice.controller.js';
import { recordPayment } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Endpoint that your frontend UI will call
router.post('/voice-create', generateVoiceInvoice);
router.post('/:id/payments', recordPayment);

export default router;