
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
        required: true,
        min: 0.01
    },
    amountPaid: {
        type: Number,
        default: 0.0,
        min: 0
    },
    purpose: {
        type: String, //e.g., "Photography", "Catering"
        required: true,
        trim: true
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
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
        description: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0.01 }
    }]
}, { timestamps: true});

invoiceSchema.pre('validate', function(next) {
    if (this.items?.length) {
        this.amount = this.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    }
    if (this.amountPaid > this.amount) return next(new Error('Amount paid cannot exceed invoice amount.'));
    return next();
});

//virtual property to calculate outstanding balance
invoiceSchema.virtual('balanceDue').get(function(){
    return this.amount - this.amountPaid;
});    

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;