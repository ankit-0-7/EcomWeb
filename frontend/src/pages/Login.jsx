import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/shop');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-heritage-bg px-4">
      <div className="max-w-md w-full">
        
        <Reveal>
            <p className="text-center text-[10px] font-sans tracking-[5px] uppercase text-heritage-gold mb-3">
                Welcome Back
            </p>
        </Reveal>
        
        <Reveal delay={0.1}>
            <h2 className="text-center font-serif text-4xl text-heritage-textLight font-light tracking-[3px] mb-2">
                Sign In
            </h2>
        </Reveal>
        
        <Reveal delay={0.2}>
            <div className="gold-line mb-12"></div>
        </Reveal>

        <Reveal delay={0.3}>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-xs text-center tracking-widest uppercase mb-6">{error}</p>}
            
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input-field mb-6 text-heritage-textLight" 
                placeholder="Email Address" 
                required 
            />
            
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input-field mb-2 text-heritage-textLight" 
                placeholder="Password" 
                required 
            />
            
            <p className="text-right font-sans text-[10px] text-heritage-textLight opacity-50 tracking-widest cursor-pointer mb-8 hover:text-heritage-gold transition-colors">
                Forgot Password?
            </p>
            
            <button 
                type="submit" 
                disabled={loading} 
                className="luxury-btn luxury-btn-filled w-full text-center disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
            
            {/* Elegant Divider */}
            <div className="flex items-center gap-4 my-8 opacity-40">
              <div className="flex-1 border-t border-heritage-border"></div>
              <span className="text-[9px] font-sans tracking-widest uppercase text-heritage-textLight">OR</span>
              <div className="flex-1 border-t border-heritage-border"></div>
            </div>

            <p className="text-center font-sans text-[10px] text-heritage-textLight opacity-70 mt-8 tracking-widest uppercase">
              New to Maison? 
              <Link to="/register" className="text-heritage-primary border-b border-heritage-primary pb-1 ml-2 hover:text-heritage-gold hover:border-heritage-gold transition-colors">
                  Create Account
              </Link>
            </p>
            
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Login;