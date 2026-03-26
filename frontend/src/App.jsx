import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import { WishlistProvider } from './context/WishlistContext'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist'; 
import ProtectedRoute from './components/ProtectedRoute';
import SellerDashboard from './pages/SellerDashboard';
import PatronDashboard from './pages/PatronDashboard'; // 🌟 NEW: Imported Patron Dashboard
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import EditorialPage from './pages/EditorialPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            
            <div className="font-sans text-heritage-textLight bg-heritage-bg min-h-screen flex flex-col selection:bg-heritage-gold selection:text-heritage-bg">
              
              <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  
                  {/* --- PROTECTED ROUTES --- */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <SellerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 🌟 NEW: Protected Route for Buyers to see their orders */}
                  <Route 
                    path="/patron" 
                    element={
                      <ProtectedRoute>
                        <PatronDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* --- PUBLIC ROUTES --- */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} /> 
                  <Route path="/success" element={<OrderSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* --- EDITORIAL / FOOTER ROUTES --- */}
                  <Route path="/our-story" element={<EditorialPage />} />
                  <Route path="/artisans" element={<EditorialPage />} />
                  <Route path="/sustainability" element={<EditorialPage />} />
                  <Route path="/shipping" element={<EditorialPage />} />
                  <Route path="/returns" element={<EditorialPage />} />
                  <Route path="/contact" element={<EditorialPage />} />
                  <Route path="/press" element={<EditorialPage />} />
                  <Route path="/careers" element={<EditorialPage />} />
                  <Route path="/size-guide" element={<EditorialPage />} />
                  <Route path="/care-guide" element={<EditorialPage />} />
                  
                </Routes>
              </main>

              <Footer />
              
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;