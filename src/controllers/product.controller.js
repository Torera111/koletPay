import Invoice from '../models/invoice.model.js';
import Product from '../models/product.model.js';
import { isPositiveMoney, isValidObjectId } from '../lib/validation.js';

export async function listProducts(req, res, next) {
    try {
        const products = await Product.find({ merchantId: req.user._id }).sort({ name: 1 });
        return res.json({ success: true, data: products });
    } catch (error) { return next(error); }
}

export async function createProduct(req, res, next) {
    try {
        const { name, kind, price, description = '' } = req.body || {};
        if (!name?.trim() || !['Product', 'Service'].includes(kind) || !isPositiveMoney(price) || typeof description !== 'string') {
            return res.status(400).json({ success: false, message: 'Name, type, positive price, and description are required.' });
        }
        const product = await Product.create({ merchantId: req.user._id, name: name.trim(), kind, price, description: description.trim() });
        return res.status(201).json({ success: true, data: product });
    } catch (error) { return next(error); }
}

export async function deleteProduct(req, res, next) {
    try {
        if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Product ID is invalid.' });
        const product = await Product.findOne({ _id: req.params.id, merchantId: req.user._id });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
        const referenced = await Invoice.exists({ merchantId: req.user._id, 'items.productId': product._id });
        if (referenced) return res.status(409).json({ success: false, message: 'This product is referenced by a historical invoice and cannot be deleted.' });
        await product.deleteOne();
        return res.status(204).send();
    } catch (error) { return next(error); }
}