const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // The Patron (Buyer)
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' } // The Artisan (Seller)
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    // 🌟 UPDATED: Dynamic Status Tracker instead of a simple boolean
    status: { 
        type: String, 
        required: true, 
        enum: ['Order Received', 'In Transit', 'Out for Delivery', 'Delivered', 'Delayed'],
        default: 'Order Received' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);