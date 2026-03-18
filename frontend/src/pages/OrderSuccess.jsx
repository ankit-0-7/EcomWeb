import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-heritage-bg flex flex-col items-center justify-center pt-20 px-4 relative overflow-hidden">
      
      {/* Opulent Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-heritage-primary opacity-5 blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-2xl px-6 border border-heritage-border bg-heritage-surface/50 p-12">
        <h2 className="text-xs font-sans text-heritage-gold tracking-[0.4em] uppercase mb-6">
          Transaction Complete
        </h2>
        
        <h1 className="text-5xl font-serif text-heritage-textLight tracking-wider mb-6">
          Thank You
        </h1>

        <div className="w-16 h-px bg-heritage-gold mx-auto mb-6 opacity-50"></div>

        <p className="text-sm font-sans text-heritage-textLight opacity-70 tracking-wide leading-relaxed mb-10">
          The Atelier has received your order. Our artisans will carefully prepare your garments for dispatch. A confirmation email will be sent shortly.
        </p>

        <Link 
          to="/shop" 
          className="inline-block bg-heritage-primary hover:bg-heritage-primaryHover text-heritage-textLight font-sans text-xs uppercase tracking-widest py-4 px-10 transition-all duration-300 border border-transparent hover:border-heritage-gold shadow-[0_0_15px_rgba(123,24,24,0.3)]"
        >
          Return to Collections
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;