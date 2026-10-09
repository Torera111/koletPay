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
        lowecase: true
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
    
    walletBalance:{
        type: Number,
        default: 0.0
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;