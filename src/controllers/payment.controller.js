import Invoice from '../models/invoice.model.js';
import Transaction from '../models/transaction.model.js';
import { isPositiveMoney, isValidObjectId } from '../lib/validation.js';

export async function recordPayment(req, res, next) {
    try {
        if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEMO_PAYMENTS !== 'true') {
            return res.status(404).json({ success: false, message: 'Payment recording is available only through a verified provider.' });
        }
        const { amount, paymentReference, providerVerified, status = 'SUCCESSFUL' } = req.body || {};
        if (!isValidObjectId(req.params.id) || !isPositiveMoney(amount) || typeof paymentReference !== 'string' || !paymentReference.trim()) {
            return res.status(400).json({ success: false, message: 'Valid invoice, positive amount, and payment reference are required.' });
        }
        if (status !== 'SUCCESSFUL' || providerVerified !== true) {
            return res.status(202).json({ success: true, message: 'Payment remains pending until the provider verifies it.' });
        }
        const invoice = await Invoice.findOne({ _id: req.params.id, merchantId: req.user._id });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
        if (amount > invoice.amount - invoice.amountPaid) return res.status(400).json({ success: false, message: 'Payment exceeds the invoice balance.' });
        const transaction = await Transaction.create({
            merchantId: req.user._id,
            invoiceId: invoice._id,
            payerId: req.user._id,
            amountPaid: amount,
            paymentReference: paymentReference.trim(),
            status: 'SUCCESSFUL'
        });
        invoice.amountPaid += amount;
        invoice.status = invoice.amountPaid >= invoice.amount ? 'PAID' : 'PART_PAID';
        await invoice.save();
        return res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        if (error?.code === 11000) return res.status(200).json({ success: true, message: 'Payment notification was already processed.' });
        return next(error);
    }
}