const attempts = new Map();

export function rateLimit({ windowMs, max }) {
    return (req, res, next) => {
        const key = `${req.ip || 'unknown'}:${req.path}`;
        const now = Date.now();
        const current = attempts.get(key);
        if (!current || current.resetAt <= now) {
            attempts.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }
        if (current.count >= max) {
            res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
            return res.status(429).json({ success: false, message: 'Too many requests. Try again later.' });
        }
        current.count += 1;
        return next();
    };
}