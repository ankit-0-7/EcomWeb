import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Reveal } from '../components/UIElements';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/shop');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 flex items-center justify-center bg-heritage-bg px-4 pb-20">
      <div className="max-w-md w-full">
        <Reveal><p className="text-center text-[10px] tracking-[5px] uppercase text-heritage-gold mb-3">Join Maison</p></Reveal>
        <Reveal delay={0.1}><h2 className="text-center font-serif text-4xl font-light tracking-[3px] mb-2">Create Account</h2></Reveal>
        <Reveal delay={0.2}><div className="gold-line mb-12"></div></Reveal>

        <Reveal delay={0.3}>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-xs text-center tracking-widest uppercase mb-6">{error}</p>}
            
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field mb-6" placeholder="Full Name" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mb-6" placeholder="Email Address" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field mb-8" placeholder="Password" required />
            
            <div className="flex justify-center gap-6 mb-10">
              <label className="text-xs tracking-widest uppercase flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={(e) => setRole(e.target.value)} className="accent-heritage-gold" />
                Patron
              </label>
              <label className="text-xs tracking-widest uppercase flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={(e) => setRole(e.target.value)} className="accent-heritage-gold" />
                Artisan
              </label>
            </div>
            
            <button type="submit" disabled={loading} className="luxury-btn luxury-btn-filled w-full text-center">
              <span>{loading ? 'Creating...' : 'Create Account'}</span>
            </button>
            
            <p className="text-center text-[11px] text-gray-500 mt-8 tracking-widest">
              Already have an account? <Link to="/login" className="text-heritage-textLight border-b border-heritage-textLight pb-1">Sign In</Link>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Register;