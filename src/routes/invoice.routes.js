// src/routes/invoice.routes.js
import { Router } from 'express';
import { generateVoiceInvoice } from '../controllers/invoice.controller.js';

const router = Router();

// Endpoint that your frontend UI will call
router.post('/voice-create', generateVoiceInvoice);

export default router;