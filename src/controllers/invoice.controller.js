// src/controllers/invoice.controller.js
import { parseVoiceCommand } from '../../services/ai.service.js';
import Invoice from '../models/invoice.model.js';
import User from '../models/user.model.js';

export const generateVoiceInvoice = async (req, res) => {
	try {
		const { rawText, merchantId } = req.body;

		if (!rawText || !merchantId) {
			return res.status(400).json({
				success: false,
				message: 'Missing rawText or merchantId.'
			});
		}

		const aiParsedData = await parseVoiceCommand(rawText, merchantId);
		let customer = await User.findOne({
			name: { $regex: new RegExp(aiParsedData.customerName, 'i') }
		});

		if (!customer) {
			customer = await User.findOne({ currentRole: 'CUSTOMER' });
			if (!customer) {
				return res.status(404).json({
					success: false,
					message: `Customer matching "${aiParsedData.customerName}" not found in DB.`
				});
			}
		}

		const newInvoice = await Invoice.create({
			merchantId,
			customerId: customer._id,
			amount: aiParsedData.amount,
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
		return res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Invoice creation failed.'
		});
	}
};
