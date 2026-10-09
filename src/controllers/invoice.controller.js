// src/controllers/invoice.controller.js
import { parseVoiceCommand } from '../services/ai.service.js';
import Invoice from '../models/invoice.model.js';
import User from '../models/user.model.js';
import { isPositiveMoney } from '../lib/validation.js';

export const generateVoiceInvoice = async (req, res) => {
	try {
		const { rawText } = req.body || {};

		if (!rawText || typeof rawText !== 'string' || rawText.length > 2000) {
			return res.status(400).json({
				success: false,
				message: 'Missing rawText or merchantId.'
			});
		}

		const merchantId = req.user._id;
		const aiParsedData = await parseVoiceCommand(rawText, merchantId.toString());
		if (!aiParsedData?.customerName || !isPositiveMoney(aiParsedData.amount) || !aiParsedData.purpose || !['FULL', 'INSTALLMENT'].includes(aiParsedData.paymentType)) {
			return res.status(422).json({ success: false, message: 'The voice command did not produce a valid invoice.' });
		}
		const escapedName = String(aiParsedData.customerName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		let customer = await User.findOne({
			merchantId,
			currentRole: 'CUSTOMER',
			name: { $regex: new RegExp(escapedName, 'i') }
		});

		if (!customer) {
			return res.status(404).json({
				success: false,
				message: `Customer matching "${aiParsedData.customerName}" not found in DB.`
			});
		}

		const newInvoice = await Invoice.create({
			merchantId,
			customerId: customer._id,
			items: [{ description: aiParsedData.purpose, quantity: 1, unitPrice: aiParsedData.amount }],
			purpose: aiParsedData.purpose,
			paymentType: aiParsedData.paymentType,
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
		});

		return res.status(201).json({
			success: true,
			message: 'Voice invoice parsed and created successfully.',
			data: newInvoice
		});
	} catch (error) {
		return res.status(error?.name === 'ValidationError' ? 400 : 500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Invoice creation failed.'
		});
	}
};
