import test from 'node:test';
import assert from 'node:assert/strict';
import { isISODate, isPositiveMoney, isValidEmail, isValidObjectId } from '../lib/validation.js';
import { validateCustomerPatch } from '../controllers/customer.controller.js';

test('customer PATCH validation accepts only valid email and ISO dates', () => {
    assert.equal(isValidEmail('merchant@example.com'), true);
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isISODate('2026-10-09'), true);
    assert.equal(isISODate('09/10/2026'), false);
});

test('customer PATCH rejects blank names and invalid supplied fields', () => {
    assert.equal(validateCustomerPatch({ name: '   ' }), 'Name cannot be blank.');
    assert.equal(validateCustomerPatch({ email: 'bad' }), 'Email address is invalid.');
    assert.equal(validateCustomerPatch({ projectDue: 'tomorrow' }), 'Project due date must use YYYY-MM-DD.');
    assert.equal(validateCustomerPatch({ notes: 'Only notes changed' }), null);
});

test('monetary validation rejects zero, negative, and non-finite values', () => {
    assert.equal(isPositiveMoney(1), true);
    assert.equal(isPositiveMoney(0), false);
    assert.equal(isPositiveMoney(-1), false);
    assert.equal(isPositiveMoney(Number.NaN), false);
});

test('route identifiers must be valid MongoDB object IDs', () => {
    assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
    assert.equal(isValidObjectId('customer-1'), false);
});