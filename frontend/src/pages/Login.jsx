import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Extract the login function, error state, and loading state from Context
  const { login, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the backend via context
    const success = await login(formData);
    
    // If successful, redirect them into the application
    if (success) {
      console.log("Successfully logged in!");
      // Temporarily redirecting to root. We will build a Dashboard/Home next.
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-heritage-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-heritage-primary to-heritage-bg"></div>

      <div className="z-10 w-full max-w-md">
        {/* Heritage Brand Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-serif text-heritage-gold tracking-widest uppercase mb-4">
            The Brand
          </h1>
          <div className="h-px w-24 bg-heritage-gold mx-auto mb-4"></div>
          <p className="text-xs text-heritage-textLight font-sans tracking-widest uppercase opacity-70">
            Enter The Atelier
          </p>
        </div>

        {/* Dark Mode Form Card */}
        <div className="bg-heritage-surface p-10 shadow-2xl border border-heritage-border relative">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-heritage-gold opacity-50"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-heritage-gold opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-heritage-gold opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-heritage-gold opacity-50"></div>

          {/* Error Display Block */}
          {error && (
            <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs text-center font-sans tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div>
              <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg placeholder-opacity-30"
                placeholder="email@example.com"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-heritage-textLight uppercase tracking-widest mb-3 opacity-80">
                Password
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-heritage-border py-2 text-heritage-textLight focus:outline-none focus:border-heritage-gold transition-colors font-serif text-lg"
                required 
              />
            </div>

            <div className="flex justify-between items-center text-xs font-sans tracking-wide">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-4 h-4 border border-heritage-gold flex justify-center items-center group-hover:bg-heritage-gold/20 transition-colors">
                  <input type="checkbox" className="opacity-0 absolute w-4 h-4 cursor-pointer" />
                </div>
                <span className="text-heritage-textLight opacity-80">Remember me</span>
              </label>
              <a href="#" className="text-heritage-gold hover:text-heritage-textLight transition-colors">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-sm uppercase tracking-widest py-4 mt-8 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entering...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-heritage-border">
            <p className="text-heritage-textLight font-sans text-xs tracking-wide opacity-80">
              Do not have an account?{' '}
              <br className="mb-2" />
              <Link to="/register" className="text-heritage-gold font-medium hover:text-heritage-textLight transition-colors tracking-widest uppercase inline-block mt-2 border-b border-transparent hover:border-heritage-textLight pb-1">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;