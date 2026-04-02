import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import { WishlistProvider } from './context/WishlistContext'; 
import { ToastProvider } from './context/ToastContext'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist'; 
import ProtectedRoute from './components/ProtectedRoute';
import SellerDashboard from './pages/SellerDashboard';
import PatronDashboard from './pages/PatronDashboard';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import EditorialPage from './pages/EditorialPage';

// 🌟 IMPORT YOUR NEW LUXURY DASHBOARD
import Dashboard from './pages/Dashboard';

// THE BOUNCER: Strictly protects your Atelier Workspace
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 🌟 LAYOUT WRAPPER FOR THE STOREFRONT
// This ensures the Navbar and Footer ONLY show up on regular shop pages,
// allowing your new Admin Dashboard to be a beautifully clean, full-screen experience.
const StorefrontLayout = () => {
  return (
    <div 
      className="bg-[#faf8f5] text-[#1a1a1a] min-h-screen flex flex-col selection:bg-[#5A1218] selection:text-[#faf8f5]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This renders whatever Storefront page is currently active */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <Router>
              <Routes>
                
                {/* 🌟 --- SECURE ADMIN ROUTE (Standalone Full-Screen) --- 🌟 */}
                {/* Notice this is OUTSIDE the StorefrontLayout so it doesn't get the public Navbar/Footer */}
                <Route 
                  path="/dashboard" 
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  } 
                />

                {/* 🌟 --- STOREFRONT ROUTES (Wrapped with Navbar & Footer) --- 🌟 */}
                <Route element={<StorefrontLayout />}>
                  
                  {/* --- STANDARD CUSTOMER ROUTE --- */}
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
                  
                </Route>

              </Routes>
            </Router>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;