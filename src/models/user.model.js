// This file handles the main profile structure and enable the "Switch Profile " toggle between ("I pay") and merchant ("I get paid") modes using an enum

import  mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    currentRole: {
        type: String,
        enum: ['MERCHANT', 'CUSTOMER'],
        default: 'MERCHANT'
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    location: { type: String, trim: true, maxlength: 160, default: '' },
    contact: { type: String, enum: ['Phone', 'Email', 'WhatsApp'], default: 'Phone' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    project: { type: String, trim: true, maxlength: 160, default: '' },
    projectDetails: { type: String, trim: true, maxlength: 2000, default: '' },
    projectDue: { type: String, default: '' },
    passwordHash: {
        type: String,
        select: false
    },
    
    walletBalance:{
        type: Number,
        default: 0.0
    }
}, {timestamps: true});

userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
export default User;