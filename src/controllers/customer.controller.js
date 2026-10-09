import User from '../models/user.model.js';
import { isISODate, isValidEmail, isValidObjectId } from '../lib/validation.js';

const editableFields = [
    'name', 'phoneNumber', 'email', 'location', 'contact',
    'notes', 'project', 'projectDetails', 'projectDue'
];
const contactMethods = new Set(['Phone', 'Email', 'WhatsApp']);

function pickFields(body) {
    return Object.fromEntries(editableFields.filter((field) => Object.prototype.hasOwnProperty.call(body, field)).map((field) => [field, body[field]]));
}

export function validateCustomerPatch(patch) {
    if (Object.prototype.hasOwnProperty.call(patch, 'name') && typeof patch.name !== 'string') return 'Name must be text.';
    if (Object.prototype.hasOwnProperty.call(patch, 'name') && !patch.name.trim()) return 'Name cannot be blank.';
    if (Object.prototype.hasOwnProperty.call(patch, 'email') && patch.email && !isValidEmail(patch.email)) return 'Email address is invalid.';
    if (Object.prototype.hasOwnProperty.call(patch, 'projectDue') && patch.projectDue && !isISODate(patch.projectDue)) return 'Project due date must use YYYY-MM-DD.';
    if (Object.prototype.hasOwnProperty.call(patch, 'contact') && !contactMethods.has(patch.contact)) return 'Preferred contact method is invalid.';
    for (const field of ['phoneNumber', 'email', 'location', 'notes', 'project', 'projectDetails', 'projectDue']) {
        if (Object.prototype.hasOwnProperty.call(patch, field) && typeof patch[field] !== 'string') return `${field} must be text.`;
    }
    return null;
}

function publicCustomer(customer) {
    const value = customer.toObject ? customer.toObject() : customer;
    delete value.passwordHash;
    delete value.__v;
    return value;
}

export async function listCustomers(req, res, next) {
    try {
        const customers = await User.find({ merchantId: req.user._id, currentRole: 'CUSTOMER' }).sort({ name: 1 });
        return res.json({ success: true, data: customers.map(publicCustomer) });
    } catch (error) { return next(error); }
}

export async function createCustomer(req, res, next) {
    try {
        const patch = pickFields(req.body || {});
        if (!patch.name || typeof patch.name !== 'string' || !patch.name.trim()) return res.status(400).json({ success: false, message: 'A non-blank name is required.' });
        const validationError = validateCustomerPatch(patch);
        if (validationError) return res.status(400).json({ success: false, message: validationError });
        const customer = await User.create({
            ...patch,
            name: patch.name.trim(),
            merchantId: req.user._id,
            currentRole: 'CUSTOMER',
            phoneNumber: patch.phoneNumber || `customer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            email: patch.email ? patch.email.trim().toLowerCase() : `customer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@invalid.local`
        });
        return res.status(201).json({ success: true, data: publicCustomer(customer) });
    } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ success: false, message: 'Customer email or phone number already exists.' });
        return next(error);
    }
}

export async function getCustomer(req, res, next) {
    try {
        if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Customer ID is invalid.' });
        const customer = await User.findOne({ _id: req.params.id, merchantId: req.user._id, currentRole: 'CUSTOMER' });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
        return res.json({ success: true, data: publicCustomer(customer) });
    } catch (error) { return next(error); }
}

export async function updateCustomer(req, res, next) {
    try {
        if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Customer ID is invalid.' });
        const patch = pickFields(req.body || {});
        const validationError = validateCustomerPatch(patch);
        if (validationError) return res.status(400).json({ success: false, message: validationError });
        if (Object.keys(patch).length === 0) return res.status(400).json({ success: false, message: 'At least one editable field is required.' });
        if (patch.name) patch.name = patch.name.trim();
        if (patch.email) patch.email = patch.email.trim().toLowerCase();
        const customer = await User.findOneAndUpdate(
            { _id: req.params.id, merchantId: req.user._id, currentRole: 'CUSTOMER' },
            { $set: patch },
            { new: true, runValidators: true }
        );
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
        return res.json({ success: true, data: publicCustomer(customer) });
    } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ success: false, message: 'Customer email or phone number already exists.' });
        return next(error);
    }
}