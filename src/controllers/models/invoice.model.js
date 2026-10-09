
// This handles the core transactional metadata parsed by the AI voice generator. It supports statuses like PART_PAID for the installment features

import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0.0
    },
    purpose: {
        type: String, //e.g., "Photography", "Catering"
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING', 'PART_PAID', 'PAID', 'OVERDUE'],
        default: 'PENDING'
    },
    paymentType: {
        type: String,
        enum: ['FULL', 'INSTALLMENT'],
        default: 'FULL'
    },
    dueDate:{
        type: Date,
        required: true
    }
}, { timestamps: true});

//virtual property to calculate outstanding balance
invoiceSchema.virtual('balanceDue').get(function(){
    return this.amount - this.amountPaid;
});    

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;