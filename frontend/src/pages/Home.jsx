import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-heritage-bg flex flex-col items-center pt-20 relative overflow-hidden">
      
      {/* Opulent Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-heritage-primary opacity-5 blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-3xl px-6">
        <h2 className="text-sm font-sans text-heritage-gold tracking-[0.3em] uppercase mb-4">
          The Atelier Awaits
        </h2>
        
        {/* Personalized Greeting */}
        <h1 className="text-5xl md:text-7xl font-serif text-heritage-textLight tracking-wider mb-8 capitalize">
          Welcome, <br className="md:hidden" />
          <span className="text-heritage-gold italic">{user?.name || 'Guest'}</span>
        </h1>

        <div className="w-24 h-px bg-heritage-border mx-auto mb-8"></div>

        <p className="text-heritage-textLight opacity-70 font-sans tracking-wide leading-relaxed mb-12">
          Step into a world of curated heritage pieces. Your journey into opulence begins here.
        </p>

        {/* Conditional Buttons based on Role */}
        {user?.role === 'seller' ? (
          <Link 
            to="/dashboard" 
            className="inline-block bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-sm uppercase tracking-widest py-4 px-10 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)]"
          >
            Manage Your Boutique
          </Link>
        ) : (
          <Link 
            to="/shop" 
            className="inline-block bg-transparent hover:bg-heritage-surface text-heritage-gold font-sans text-sm uppercase tracking-widest py-4 px-10 transition-all duration-300 border border-heritage-gold"
          >
            Explore Collections
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;