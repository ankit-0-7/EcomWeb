const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allows us to parse JSON bodies from frontend requests
app.use(cors());         // Prevents Cross-Origin Resource Sharing errors during development

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

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Basic Route to test server
app.get('/', (req, res) => {
    res.send('Premium E-commerce API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});