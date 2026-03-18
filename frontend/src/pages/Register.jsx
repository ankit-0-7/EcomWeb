import React, { useState, useContext } from 'react'; // Added useContext
import { Link, useNavigate } from 'react-router-dom'; // Cleaned up duplicate imports
import { AuthContext } from '../context/AuthContext'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' // Default role
  });

  // Extract the register logic, error state, and loading state from our Context Vault
  const { register, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the backend via context instead of just console logging
    const success = await register(formData);
    
    // If the database successfully creates the user, redirect them to the Login page
    if (success) {
      console.log("Successfully created account!");
      navigate('/login'); 
    }
  };

  return (
    <div className="min-h-screen bg-heritage-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-heritage-primary to-heritage-bg"></div>

      <div className="z-10 w-full max-w-md my-8">
        {/* Heritage Brand Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-serif text-heritage-gold tracking-widest uppercase mb-4">
            The Brand
          </h1>
          <div className="h-px w-24 bg-heritage-gold mx-auto mb-4"></div>
          <p className="text-xs text-heritage-textLight font-sans tracking-widest uppercase opacity-70">
            Join The Atelier
          </p>
        </div>

        {/* Dark Mode Form Card */}
        <div className="bg-heritage-surface p-10 shadow-2xl border border-heritage-border relative">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-heritage-gold opacity-50"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-heritage-gold opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-heritage-gold opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-heritage-gold opacity-50"></div>

          {/* Error Display Block: Shows backend errors (like "Email already exists") directly on the UI */}
          {error && (
            <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs text-center font-sans tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection Toggle */}
            <div className="mb-6">
              <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80 text-center">
                I want to...
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="flex-1 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="role" 
                    value="customer" 
                    className="peer sr-only" 
                    onChange={handleChange} 
                    checked={formData.role === 'customer'} 
                  />
                  <div className="text-center py-3 border border-heritage-border peer-checked:border-heritage-gold peer-checked:text-heritage-gold text-heritage-textLight opacity-60 peer-checked:opacity-100 transition-all font-sans text-xs tracking-widest uppercase bg-transparent">
                    Shop
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="role" 
                    value="seller" 
                    className="peer sr-only" 
                    onChange={handleChange} 
                    checked={formData.role === 'seller'} 
                  />
                  <div className="text-center py-3 border border-heritage-border peer-checked:border-heritage-gold peer-checked:text-heritage-gold text-heritage-textLight opacity-60 peer-checked:opacity-100 transition-all font-sans text-xs tracking-widest uppercase bg-transparent">
                    Sell
                  </div>
                </label>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-2 opacity-80">
                Full Name
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg placeholder-opacity-30"
                required 
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-2 opacity-80">
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg placeholder-opacity-30"
                required 
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-2 opacity-80">
                Password
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg"
                minLength="6"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} // Prevents multiple clicks while processing
              className="w-full bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-sm uppercase tracking-widest py-4 mt-8 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Dynamic text based on loading state */}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-heritage-border">
            <p className="text-heritage-textLight font-sans text-xs tracking-wide opacity-80">
              Already a member?{' '}
              <br className="mb-2" />
              <Link to="/login" className="text-heritage-gold font-medium hover:text-heritage-textLight transition-colors tracking-widest uppercase inline-block mt-2 border-b border-transparent hover:border-heritage-textLight pb-1">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;