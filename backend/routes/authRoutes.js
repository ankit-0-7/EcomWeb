const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController'); // Import getProducts
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, seller } = require('../middleware/authMiddleware');

// Public Route: Anyone can view the collection
router.get('/', getProducts);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/', protect, seller, createProduct);

module.exports = router;