import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/UIElements';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center pt-20 px-4 relative overflow-hidden selection:bg-[#5A1218] selection:text-[#faf8f5]">
      
      {/* Opulent Niali Burgundy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-[#5A1218] opacity-[0.03] blur-[120px] pointer-events-none"></div>

      <Reveal>
        <div className="z-10 text-center max-w-2xl px-6 md:px-16 py-16 border border-[#e8e6e2] bg-[#f5f3f0] shadow-sm relative">
          
          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] text-[#5A1218] tracking-[0.4em] uppercase mb-6">
            Order Confirmed
          </p>
          
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-5xl text-[#1a1a1a] tracking-[3px] mb-8 font-normal">
            Thank You
          </h1>

          <div className="w-12 h-[1px] bg-[#5A1218] mx-auto mb-8"></div>

          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[12px] text-[#666] tracking-wide leading-relaxed mb-12 max-w-md mx-auto">
            Niali has received your order. Our artisans will meticulously prepare your garments for dispatch. A confirmation email with your tracking details will be sent shortly.
          </p>

          <Link 
            to="/patron" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="inline-block bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors shadow-lg mb-4 w-full md:w-auto"
          >
            Track My Order
          </Link>
          
          <br />

          <Link 
            to="/shop" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="inline-block text-[#999] text-[10px] tracking-widest uppercase hover:text-[#5A1218] transition-colors mt-4 border-b border-transparent hover:border-[#5A1218] pb-1"
          >
            Continue Discovering
          </Link>
          
        </div>
      </Reveal>
    </div>
  );
};

export default OrderSuccess;