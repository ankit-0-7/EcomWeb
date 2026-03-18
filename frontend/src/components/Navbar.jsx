import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { LogOut, ShoppingBag, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  // DEFENSIVE APPROACH: We grab the whole context first.
  const cartContext = useContext(CartContext);
  
  // If the context exists, grab cartItems. If it's undefined (during loading), fallback to an empty array [].
  const cartItems = cartContext?.cartItems || []; 

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate total items for the gold badge
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-heritage-bg border-b border-heritage-border py-4 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="text-2xl font-serif text-heritage-gold tracking-widest uppercase">
          The Brand
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/shop" className="text-xs font-sans text-heritage-textLight uppercase tracking-widest hover:text-heritage-gold transition-colors opacity-80 hover:opacity-100">
            Collections
          </Link>
          <Link to="/" className="text-xs font-sans text-heritage-textLight uppercase tracking-widest hover:text-heritage-gold transition-colors opacity-80 hover:opacity-100">
            Heritage
          </Link>
        </div>

        {/* Right Side: User Actions */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-xs font-sans text-heritage-gold uppercase tracking-widest hidden sm:block border border-heritage-gold/30 px-2 py-1">
                {user.role}
              </span>
              
              <Link to="/profile" className="text-heritage-textLight hover:text-heritage-gold transition-colors">
                <UserIcon size={20} strokeWidth={1.5} />
              </Link>
              
              {/* Shopping Bag with Dynamic Gold Badge */}
              <Link to="/cart" className="relative text-heritage-textLight hover:text-heritage-gold transition-colors">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-heritage-gold text-heritage-bg text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button 
                onClick={handleLogout}
                className="text-heritage-textLight hover:text-heritage-primary transition-colors flex items-center gap-2 text-xs font-sans uppercase tracking-widest"
              >
                <LogOut size={18} strokeWidth={1.5} />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-xs font-sans text-heritage-textLight uppercase tracking-widest hover:text-heritage-gold transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;