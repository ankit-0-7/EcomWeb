import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Reveal } from '../components/UIElements';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to load garment details');
        }
        
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToBag = () => {
    addToCart({ ...product, id: product._id, qty: 1 }); 
    
    const btn = document.getElementById('add-btn-text');
    const originalText = btn.innerText;
    btn.innerText = 'Added to Bag';
    
    setTimeout(() => { 
        btn.innerText = originalText; 
    }, 2000);
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#faf8f5] flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-[#5A1218] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center items-center text-red-800 tracking-widest uppercase text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <p className="mb-4">{error}</p>
            <button onClick={() => navigate(-1)} className="border-b border-red-800 pb-1 text-xs hover:opacity-70 transition-opacity">Return to Collection</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20 px-6 md:px-12 selection:bg-[#5A1218] selection:text-[#faf8f5]">
      <div className="max-w-[1200px] mx-auto">
        
        <Reveal>
            <button 
              onClick={() => navigate(-1)} 
              style={{ fontFamily: "'Montserrat', sans-serif" }} 
              className="text-[10px] text-[#999] tracking-widest uppercase hover:text-[#5A1218] transition-colors mb-12 flex items-center gap-2"
            >
                <span>←</span> Return to Collection
            </button>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Image */}
          <Reveal direction="right">
            <div className="relative overflow-hidden bg-[#eee] aspect-[3/4] shadow-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </Reveal>

          {/* Right Column: Garment Details */}
          <Reveal delay={0.2} direction="left">
            <div className="flex flex-col justify-center py-8">
              
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] text-[#5A1218] tracking-[0.3em] uppercase mb-4 font-medium">
                  {product.category}
              </p>

              {/* 🌟 ALLURA ACCENT: Decorative Tagline */}
              <p style={{ 
                fontFamily: "'Allura', cursive", 
                fontSize: "28px", 
                color: "#5A1218", 
                marginBottom: "-10px",
                opacity: 0.9
              }}>
                Handcrafted with intention
              </p>
              
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl lg:text-5xl font-normal text-[#1a1a1a] tracking-[1px] mb-6 leading-tight">
                  {product.name}
              </h1>
              
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl text-[#666] mb-8 tracking-wider font-light">
                  INR {product.price?.toLocaleString('en-IN')}
              </p>

              <div className="w-12 h-[1px] bg-[#5A1218] mb-8"></div>

              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[13px] text-[#666] leading-relaxed tracking-wide mb-12 max-w-lg font-light">
                {product.description || "An exquisite piece from our Niali atelier, handcrafted by master artisans using time-honoured techniques. Designed with intention, this garment celebrates quiet luxury and stands apart from fleeting trends."}
              </p>

              {/* 🌟 ALLURA ACCENT: Designer Signature Section */}
              <div className="mb-12 flex items-center gap-6 border-t border-b border-[#e8e6e2] py-8 max-w-md">
                <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="w-14 h-14 rounded-full bg-[#f5f3f0] border border-[#e8e6e2] flex items-center justify-center text-[#5A1218] text-2xl">
                  {product.user?.name ? product.user.name.charAt(0).toUpperCase() : 'N'}
                </div>
                <div>
                  <p style={{ fontFamily: "'Allura', cursive", fontSize: "26px", color: "#1a1a1a", marginBottom: "-5px" }}>
                    {product.user?.name || "Nisha Bhardwaj"}
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#999] tracking-[0.2em] uppercase">
                    Creative Director & Artisan
                  </p>
                </div>
              </div>

              {/* The Niali Luxury Button */}
              <button 
                onClick={handleAddToBag} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                className="bg-[#5A1218] text-[#faf8f5] px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#3a0a0f] transition-colors w-full md:w-auto max-w-[300px] text-center shadow-lg"
              >
                <span id="add-btn-text">Add to Bag</span>
              </button>

              <div className="mt-8 flex flex-col gap-3">
                 <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#999] tracking-widest uppercase flex items-center gap-2">
                   <span className="w-1 h-1 bg-[#5A1218] rounded-full"></span> Complimentary Shipping
                 </p>
                 <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] text-[#999] tracking-widest uppercase flex items-center gap-2">
                   <span className="w-1 h-1 bg-[#5A1218] rounded-full"></span> Timeless Craftsmanship
                 </p>
              </div>

            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;