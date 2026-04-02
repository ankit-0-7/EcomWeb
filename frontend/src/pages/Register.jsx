import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 🌟 MAGIC FIX: We hardcode 'customer' as the role here. 
      // Users no longer have a choice; everyone who signs up is a standard customer.
      await register(name, email, password, 'customer');
      navigate('/shop');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 flex items-center justify-center bg-[#faf8f5] px-4 pb-20 selection:bg-[#5A1218] selection:text-[#faf8f5]">
      <div className="max-w-md w-full">
        
        <Reveal>
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-[10px] tracking-[5px] uppercase text-[#5A1218] mb-3">
                Join Niali
            </p>
        </Reveal>
        
        <Reveal delay={0.1}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-center text-4xl text-[#1a1a1a] font-normal tracking-[3px] mb-6">
                Create Account
            </h2>
        </Reveal>
        
        <Reveal delay={0.2}>
            <div className="w-12 h-[1px] bg-[#5A1218] mx-auto mb-12"></div>
        </Reveal>

        <Reveal delay={0.3}>
          <form onSubmit={handleSubmit} className="px-2">
            {error && (
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-red-800 text-[10px] text-center tracking-widest uppercase mb-6 bg-red-100/50 py-3">
                    {error}
                </p>
            )}
            
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="w-full bg-transparent border-b border-[#ccc] pb-3 mb-8 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" 
                placeholder="Full Name" 
                required 
            />
            
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="w-full bg-transparent border-b border-[#ccc] pb-3 mb-8 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" 
                placeholder="Email Address" 
                required 
            />
            
            {/* 🌟 I added a margin-bottom of mb-10 here since we removed the radio buttons below it */}
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="w-full bg-transparent border-b border-[#ccc] pb-3 mb-10 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#5A1218] text-[#1a1a1a] placeholder:text-[#999] transition-colors" 
                placeholder="Password" 
                required 
            />
            
            {/* 🛑 DELETED: The Role Selection Radio Buttons used to be here */}
            
            <button 
                type="submit" 
                disabled={loading} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="w-full bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors shadow-lg disabled:opacity-50"
            >
              <span>{loading ? 'Creating...' : 'Create Account'}</span>
            </button>
            
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-[10px] text-[#666] mt-8 tracking-widest uppercase">
              Already have an account? 
              <Link to="/login" className="text-[#5A1218] border-b border-[#5A1218] pb-1 ml-3 hover:opacity-70 transition-opacity">
                  Sign In
              </Link>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Register;