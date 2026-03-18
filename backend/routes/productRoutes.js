const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    getSellerProducts, 
    deleteProduct 
} = require('../controllers/productController'); 
const { protect, seller } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getProducts);

// Protected Seller Routes
router.get('/seller', protect, seller, getSellerProducts); // MUST BE BEFORE /:id
router.post('/', protect, seller, createProduct);

// Public Route (Dynamic ID)
router.get('/:id', getProductById);

// Protected Seller Route (Dynamic ID)
router.delete('/:id', protect, seller, deleteProduct);

module.exports = router;