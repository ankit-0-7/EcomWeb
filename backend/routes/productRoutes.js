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

const { protect, seller } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getProducts);

// Protected Seller Routes
router.get('/seller', protect, seller, getSellerProducts); // MUST BE BEFORE /:id
router.post('/', protect, seller, createProduct);

// Public Route (Dynamic ID)
router.get('/:id', getProductById);

// Protected Seller Route (Dynamic IDs)
router.delete('/:id', protect, seller, deleteProduct);
router.put('/:id', protect, seller, updateProduct); // The new Edit route!

module.exports = router;