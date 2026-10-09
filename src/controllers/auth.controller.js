import crypto from 'node:crypto';
import { promisify } from 'node:util';
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import { hashSessionToken, readSessionToken, SESSION_COOKIE } from '../middleware/auth.js';
import { isValidEmail } from '../lib/validation.js';

const scrypt = promisify(crypto.scrypt);
const SESSION_DAYS = 7;

function passwordError(password) {
    return typeof password !== 'string' || password.length < 8;
}

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, stored) {
    const [salt, key] = String(stored || '').split(':');
    if (!salt || !key) return false;
    const derivedKey = await scrypt(password, salt, 64);
    const expected = Buffer.from(key, 'hex');
    return expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey);
}

function setSessionCookie(res, token) {
    const attributes = [
        `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
        'Path=/',
        `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
        'HttpOnly',
        'SameSite=Lax'
    ];
    if (process.env.NODE_ENV === 'production') attributes.push('Secure');
    res.setHeader('Set-Cookie', attributes.join('; '));
}

function clearSessionCookie(res) {
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}

async function createSession(user, res) {
    const token = crypto.randomBytes(32).toString('base64url');
    await Session.create({
        tokenHash: hashSessionToken(token),
        userId: user._id,
        expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
    });
    setSessionCookie(res, token);
}

export async function register(req, res, next) {
    try {
        const { name, email, phoneNumber, password } = req.body || {};
        if (!name?.trim() || !isValidEmail(email) || !phoneNumber?.trim() || passwordError(password)) {
            return res.status(400).json({ success: false, message: 'Name, valid email, phone number, and an 8-character password are required.' });
        }
        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phoneNumber: phoneNumber.trim(),
            passwordHash: await hashPassword(password),
            currentRole: 'MERCHANT'
        });
        await createSession(user, res);
        return res.status(201).json({ success: true, data: user.toJSON() });
    } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ success: false, message: 'Email or phone number is already registered.' });
        return next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body || {};
        if (!isValidEmail(email) || typeof password !== 'string') {
            return res.status(400).json({ success: false, message: 'Valid email and password are required.' });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase(), currentRole: 'MERCHANT' }).select('+passwordHash');
        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        await createSession(user, res);
        return res.status(200).json({ success: true, data: user.toJSON() });
    } catch (error) {
        return next(error);
    }
}

export async function currentSession(req, res) {
    return res.status(200).json({ success: true, data: req.user.toJSON() });
}

export async function logout(req, res, next) {
    try {
        const token = readSessionToken(req);
        if (token) await Session.deleteOne({ tokenHash: hashSessionToken(token) });
        clearSessionCookie(res);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}