import mongoose from 'mongoose';

export function isValidObjectId(value) {
    return typeof value === 'string' && mongoose.isValidObjectId(value);
}

export function isValidEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isISODate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
}

export function isPositiveMoney(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}