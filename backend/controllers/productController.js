// We declare Product exactly ONCE at the very top
const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        const product = new Product({
            user: req.user._id, // This comes directly from our 'protect' middleware
            name,
            description,
            price,
            category,
            image
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        // Find all products in the database and pull in the seller's name
        const products = await Product.find({}).populate('user', 'name');
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};
// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        // req.params.id grabs the ID from the URL
        const product = await Product.findById(req.params.id).populate('user', 'name');
        
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Garment not found in the Atelier' });
        }
    } catch (error) {
        // If the ID is completely malformed, MongoDB throws a CastError
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Garment not found' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// @desc    Fetch products created by the logged-in seller
// @route   GET /api/products/seller
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
    try {
        // req.user._id is securely provided by our authMiddleware
        const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your collection', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Garment not found' });
        }

        // Security Check: Make sure the logged-in user actually owns this product
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to remove this garment' });
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Garment successfully removed from the Atelier' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during deletion', error: error.message });
    }
};
// @desc    Update a product (Edit)
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Garment not found' });
        }

        // Security Check: Make sure the artisan owns this garment
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this garment' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Returns the newly updated document
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update garment', error: error.message });
    }
};