const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const Collection = require('./models/Collection');
const Order = require('./models/Order');
const { protect, seller } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors()); 

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Mount Standard Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// ==========================================
// --- COLLECTION ROUTES ---
// ==========================================

app.get('/api/collections', async (req, res) => {
    try {
        const collections = await Collection.find();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch collections' });
    }
});

app.post('/api/collections', async (req, res) => {
    try {
        const newCollection = new Collection(req.body);
        await newCollection.save();
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create collection', error: error.message });
    }
});

app.delete('/api/collections/:id', async (req, res) => {
    try {
        await Collection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Collection removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete collection', error: error.message });
    }
});

// ==========================================
// --- ORDER ROUTES ---
// ==========================================

// 1. POST: Create a new order (Cart Checkout)
app.post('/api/orders', protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            totalPrice
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
});

// 2. GET: Fetch orders for the Patron (Buyer Dashboard)
app.get('/api/orders/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your orders', error: error.message });
    }
});

// 3. GET: Fetch orders for the Artisan (Seller Dashboard)
app.get('/api/orders/seller', protect, seller, async (req, res) => {
    try {
        const orders = await Order.find({ 'orderItems.seller': req.user._id })
                                  .populate('user', 'name email') 
                                  .sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
});

// 4. PUT: Update Order Status (Seller Dashboard Dropdown)
app.put('/api/orders/:id/status', protect, seller, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status; // 🌟 Takes the specific status from the dropdown
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
});


// ==========================================
// --- SERVER INITIALIZATION ---
// ==========================================

app.get('/', (req, res) => {
    res.send('Premium E-commerce API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});