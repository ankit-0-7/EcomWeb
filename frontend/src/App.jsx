import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartContext, CartProvider } from './context/CartContext'; // Imported CartProvider

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import SellerDashboard from './pages/SellerDashboard';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <AuthProvider>
      {/* CRITICAL FIX: CartProvider must wrap the Router and Navbar 
        so that every page can access the shopping bag data.
      */}
      <CartProvider>
        <Router>
          <div className="font-sans text-heritage-textLight bg-heritage-bg min-h-screen selection:bg-heritage-gold selection:text-heritage-bg">
            
            {/* Navbar sits outside the Routes so it appears on every page */}
            <Navbar />
            
            <Routes>
              {/* Protected Home Route */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Seller Dashboard Route */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} /> {/* YOUR NEW ROUTE! */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;