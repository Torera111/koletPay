//This file tracks partial payments. Whenever a user makes an installment payment toward an invoice via "Pay in  Parts", its logs an individual receipt block here

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    invoiceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    payerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    amountPaid:{
        type: Number,
        required: true
    },
    paymentReference:{
        type: String, //For mocking Wema/ALAT transfer reference
        required: true,
        unique: true
    },
    status:{
        type: String,
        enum: ['SUCCESSFUL', 'FAILED', 'PENDING'],
        default: 'SUCCESSFUL'
    }
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;