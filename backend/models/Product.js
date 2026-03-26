const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Reference to the User who created this product
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0.0
    },
    category: {
        type: String,
        required: [true, 'Please add a category (e.g., Lehengas, Sarees, Menswear)'],
    },
    belongsToCollection: { type: String, default: '' },
    // For Phase 1 (free basic tools), we will just store an image URL (like a link from Unsplash or Imgur). 
    // Later, you will replace this with an AWS S3 upload link.
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);