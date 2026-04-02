const express = require('express');
const router = express.Router();

// We put ALL the controller functions in one single import to prevent the crash!
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    getSellerProducts, 
    deleteProduct,
    updateProduct 
} = require('../controllers/productController'); 

// 🌟 FIXED: Imported 'admin' instead of 'seller'
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getProducts);

// 🌟 FIXED: Replaced 'seller' with 'admin' to match your new dashboard role
router.get('/seller', protect, admin, getSellerProducts); // Keep the path as /seller so we don't break your controller
router.post('/', protect, admin, createProduct);

// Public Route (Dynamic ID)
router.get('/:id', getProductById);

// 🌟 FIXED: Replaced 'seller' with 'admin' on these routes too
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id', protect, admin, updateProduct); // The new Edit route!

module.exports = router;