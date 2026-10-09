import { Router } from 'express';
import { currentSession, login, logout, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rate-limit.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/session', requireAuth, currentSession);
router.post('/logout', logout);

export default router;