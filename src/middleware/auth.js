import crypto from 'node:crypto';
import Session from '../models/session.model.js';
import User from '../models/user.model.js';

export const SESSION_COOKIE = 'koletpay_session';

function tokenHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function readSessionToken(req) {
    const header = req.headers.cookie || '';
    const entry = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
    return entry ? decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1)) : null;
}

export async function requireAuth(req, res, next) {
    try {
        const token = readSessionToken(req);
        if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
        const session = await Session.findOne({ tokenHash: tokenHash(token), expiresAt: { $gt: new Date() } });
        if (!session) return res.status(401).json({ success: false, message: 'Session expired.' });
        const user = await User.findById(session.userId);
        if (!user || user.currentRole !== 'MERCHANT') {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        req.user = user;
        req.session = session;
        return next();
    } catch (error) {
        return next(error);
    }
}

export function hashSessionToken(token) {
    return tokenHash(token);
}