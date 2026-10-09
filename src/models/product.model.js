import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    kind: { type: String, enum: ['Product', 'Service'], required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, maxlength: 500, default: '' }
}, { timestamps: true });

productSchema.index({ merchantId: 1, name: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;