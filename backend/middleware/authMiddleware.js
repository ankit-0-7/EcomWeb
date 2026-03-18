const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Route: Ensures the user is logged in
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// 2. Seller Route: Ensures the logged-in user has the 'seller' or 'admin' role
exports.seller = (req, res, next) => {
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        next(); 
    } else {
        res.status(403).json({ message: 'Access denied: Seller privileges required' });
    }
};